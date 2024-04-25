// File: class-session.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import  ClassSession from "../interfaces/class-sesion.interface";
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClassSessionService {
  private userCollection: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private auth: Auth
  ) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userCollection = `users/${user.uid}/timetable`;  // Set the user-specific path when a user is logged in
      } else {
        this.userCollection = null;  // Reset when no user is logged in
      }
    });
  }

  addClassSession(session: ClassSession): Promise<void> {
    if (!this.userCollection) {
      return Promise.reject(new Error("No user is currently authenticated."));
    }
    const sessionData = this.toFirestoreDocument(session);
    return this.firestore.collection<ClassSession>(this.userCollection).add(<ClassSession>sessionData).then(() => {});
  }

  getClassSessions(): Observable<ClassSession[]> {
    if (!this.userCollection) {
      throw new Error("No user is currently authenticated.");
    }
    return this.firestore.collection<ClassSession>(this.userCollection, ref => ref.orderBy('start')).valueChanges({ idField: 'id' });
  }

  updateClassSession(sessionId: string, session: ClassSession): Promise<void> {
    if (!this.userCollection) {
      return Promise.reject(new Error("No user is currently authenticated."));
    }
    const sessionData = this.toFirestoreDocument(session);
    return this.firestore.doc<ClassSession>(`${this.userCollection}/${sessionId}`).update(sessionData);
  }

  deleteClassSession(sessionId: string): Promise<void> {
    if (!this.userCollection) {
      return Promise.reject(new Error("No user is currently authenticated."));
    }
    return this.firestore.doc(`${this.userCollection}/${sessionId}`).delete();
  }

  private toFirestoreDocument(session: ClassSession): {} {
    return {
      start: session.start instanceof Timestamp ? session.start : Timestamp.fromDate(session.start),
      end: session.end instanceof Timestamp ? session.end : Timestamp.fromDate(session.end),
      subject: session.subject,
      day: session.day,
      color: session.color
    };
  }
}
