import Course from "./course.interface";
import {DocumentReference} from "@angular/fire/firestore";

export default interface Professor {
  id?: string;
  name: string;
  email: string;
  courseRef: DocumentReference<Course>;
}
