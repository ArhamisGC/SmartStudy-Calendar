import {DocumentReference} from "@angular/fire/firestore";
import Professor from "./professor.interface";
import Course from "./course.interface";

export default interface Note {
  color: string;
  id?: string;
  title: string;
  description: string;
  courseRef?: DocumentReference<Course>;
  courseName?: string;
  date: Date;
  formattedDate:string;
}
