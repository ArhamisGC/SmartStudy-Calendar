import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  deleteDoc,
  updateDoc,
  addDoc,
  DocumentReference
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import Reminder from '../interfaces/reminder.interface';
import firebase from 'firebase/compat';
import DocumentData = firebase.firestore.DocumentData;

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private getUserId(): string {
    return this.auth.currentUser?.uid ?? '';
  }

  getReminders(): Observable<Reminder[]> {
    const userId = this.getUserId();
    const remindersRef = collection(this.firestore, `users/${userId}/reminders`);
    return collectionData(remindersRef, { idField: 'id' }) as Observable<Reminder[]>;
  }

  addReminder(reminderData: Reminder): Promise<DocumentReference<DocumentData>> {
    const userId = this.getUserId();
    const remindersRef = collection(this.firestore, `users/${userId}/reminders`);
    return addDoc(remindersRef, reminderData);
  }

  modifyReminder(reminderId: string, reminderData: Partial<Reminder>): Promise<void> {
    const userId = this.getUserId();
    const reminderRef = doc(this.firestore, `users/${userId}/reminders`, reminderId);
    return updateDoc(reminderRef, reminderData);
  }

  deleteReminder(reminderId: string): Promise<void> {
    const userId = this.getUserId();
    const reminderRef = doc(this.firestore, `users/${userId}/reminders`, reminderId);
    return deleteDoc(reminderRef);
  }
}
