import { Injectable } from '@angular/core';
import Task from '../interfaces/task.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Auth } from '@angular/fire/auth'; // Asegúrate de importar Auth

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: AngularFirestore, private auth: Auth) {}

  private getUserId(): string {
    return this.auth.currentUser?.uid ?? '';
  }

  getTasks() {
    const userId = this.getUserId();
    return this.firestore.collection<Task>(`users/${userId}/tasks`).valueChanges({ idField: 'id' });
  }

  addTask(task: Omit<Task, 'id'>) {
    const userId = this.getUserId();
    this.firestore.collection<Task>(`users/${userId}/tasks`).add(task as Task);
  }

  removeTask(taskId: string) {
    const userId = this.getUserId();
    this.firestore.collection<Task>(`users/${userId}/tasks`).doc(taskId).delete();
  }

  updateTask(id: string, changes: Partial<Task>) {
    const userId = this.getUserId();
    this.firestore.collection<Task>(`users/${userId}/tasks`).doc(id).update(changes);
  }
}
