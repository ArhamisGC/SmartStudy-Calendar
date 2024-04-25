import {DocumentReference, Timestamp} from "@angular/fire/firestore";
import Course from "./course.interface";

export default interface ClassSesion  {
  start: Timestamp;
  end: Timestamp;
  subject: DocumentReference<Course>;
  day: string;
  color: string;
  id?: string;
}
