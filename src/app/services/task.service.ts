import { Injectable } from '@angular/core';
import Task from '../interfaces/task.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: AngularFirestore) {}

  getTasks() {
    return this.firestore.collection<Task>('tasks').valueChanges({ idField: 'id' });
  }

  addTask(task: Omit<Task, 'id'>) {
    this.firestore.collection<Task>('tasks').add(task as Task);
  }

  removeTask(taskId: string) {
    this.firestore.collection<Task>('tasks').doc(taskId).delete();
  }

  updateTask(id: string, changes: Partial<Task>) {
    this.firestore.collection<Task>('tasks').doc(id).update(changes);
  }
}

