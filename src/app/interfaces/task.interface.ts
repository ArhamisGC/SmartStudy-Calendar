import { DocumentReference } from '@angular/fire/firestore';
import Course from "./course.interface";

export default interface Task {
  id: string;
  order: number;
  title: string;
  description?: string;
  course?: DocumentReference<Course>
  priority: TaskPriority;
  status: TaskStatus;
  editing: boolean;
}

enum TaskStatus {
  Pending = 0,
  Completed = 1,
}

enum TaskPriority {
  Low,
  Medium,
  High,
}