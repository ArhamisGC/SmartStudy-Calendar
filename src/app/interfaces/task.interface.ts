import { DocumentReference } from '@angular/fire/firestore';
import Course from "./course.interface";
import {TaskStatus} from "./typeOfTask.interface";
import {TaskPriority} from "./typeOfTask.interface";

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
