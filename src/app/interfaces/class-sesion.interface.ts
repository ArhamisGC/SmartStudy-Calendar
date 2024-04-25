import {DocumentReference, Timestamp} from "@angular/fire/firestore";
import Course from "./course.interface";

export default interface ClassSesion  {
  subjectName?: string;
  start: Timestamp;
  end: Timestamp;
  subject: DocumentReference<Course>;
  day: string;
  color: string;
  id?: string;
}
