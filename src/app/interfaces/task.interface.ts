import { DocumentReference } from '@angular/fire/firestore';
import Course from "./course.interface";

export default interface Task {
  id: string;
  order: number;
  title: string;
  description?: string;
  courseRef?: DocumentReference<Course>
  priority: TaskPriority;
  status: TaskStatus;
  editing: boolean;
  courseId?: string;
  courseName?: string;
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