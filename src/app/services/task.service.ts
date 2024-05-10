import { Injectable } from '@angular/core';
import Task from '../interfaces/task.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth } from '@angular/fire/auth';
import { take } from "rxjs";
import { map, switchMap } from "rxjs/operators"; // Asegúrate de importar Auth

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: AngularFirestore, private auth: Auth) { }

  private getUserId(): string {
    return this.auth.currentUser?.uid ?? '';
  }

  getTasks() {
    const userId = this.getUserId();
    return this.firestore.collection<Task>(`users/${userId}/tasks`, ref => ref.orderBy('order')).valueChanges({ idField: 'id' });
  }

  addTask(task: Omit<Task, 'id'>) {
    const userId = this.getUserId();
    task.priority = +task.priority;
    this.firestore.collection<Task>(`users/${userId}/tasks`)
      .valueChanges()
      .pipe(
        take(1),
        map(tasks => tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 1),
        switchMap(order => {
          task.order = order;
          return this.firestore.collection<Task>(`users/${userId}/tasks`).add(task as Task);
        })
      ).subscribe();
  }

  removeTask(taskId: string) {
    const userId = this.getUserId();
    this.firestore.collection<Task>(`users/${userId}/tasks`).doc(taskId).delete().then(() => {
      this.adjustOrdersAfterDeletion(userId);
    });
  }

  private adjustOrdersAfterDeletion(userId: string) {
    this.firestore.collection<Task>(`users/${userId}/tasks`, ref => ref.orderBy('order'))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(snapshot => {
        snapshot.forEach((doc, index) => {
          doc.payload.doc.ref.update({ order: index + 1 });
        });
      });
  }

  updateTask(id: string, changes: Partial<Task>) {
    const userId = this.getUserId();
    if (typeof changes.priority === 'string') {
      changes.priority = +changes.priority;  // Convertir a número si es string
    }
    this.firestore.collection<Task>(`users/${userId}/tasks`).doc(id).update(changes);
  }
}
