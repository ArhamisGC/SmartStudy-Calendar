import { Injectable } from '@angular/core';
import {
  Firestore,
  docData,
  DocumentReference,
  collectionData,
  collection,
  deleteDoc,
  doc, updateDoc, addDoc, query, where, getDocs
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {Notification} from "../interfaces/notification.interface";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private get userId(): string {
    return this.auth.currentUser?.uid ?? ' ';
  }
  getAllNotifications(): Observable<Notification[]> {
    const userNotificationsCollectionRef = collection(this.firestore, `users/${this.userId}/notifications`);
    return collectionData(userNotificationsCollectionRef, { idField: 'id' }) as Observable<Notification[]>;
  }

  async addNotification(newNotification: Notification): Promise<void> {
    const userNotificationsCollectionRef = collection(this.firestore, `users/${this.userId}/notifications`);
    await addDoc(userNotificationsCollectionRef, newNotification);
  }

  deleteNotification(notificationId: string): Promise<void> {
    const notificationDocRef = doc(this.firestore, `users/${this.userId}/notifications`, notificationId);
    return deleteDoc(notificationDocRef);
  }
}
