import { Injectable } from '@angular/core';
import {
  Firestore,
  docData,
  DocumentReference,
  collectionData,
  collection,
  deleteDoc,
  doc, updateDoc, addDoc, query, getDocs, where, setDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth'; // Importa Auth para obtener el usuario autenticado
import { Observable } from 'rxjs';
import Professor from '../interfaces/professor.interface';
import Course from "../interfaces/course.interface";

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private get userId(): string {
    return this.auth.currentUser?.uid ?? '';
  }

  async addProfessor(newProfessor: Professor): Promise<void> {
    const userProfessorsCollectionRef = collection(this.firestore, `users/${this.userId}/professors`);
    const newProfessorDocRef = doc(userProfessorsCollectionRef);
    newProfessor.id = newProfessorDocRef.id;
    await setDoc(newProfessorDocRef, newProfessor);
  }
  async deleteProfessor(professorId: string): Promise<void> {
    const professorDocRef = doc(this.firestore, `users/${this.userId}/professors`, professorId);
    await deleteDoc(professorDocRef);
  }

  async updateProfessor(professorId: string, updatedProfessorData: Professor): Promise<void> {
    const professorDocRef = doc(this.firestore, `users/${this.userId}/professors`, professorId);
    // @ts-ignore
    await updateDoc(professorDocRef, updatedProfessorData);
  }

  async getProfessorsByCourseRef(courseRef: DocumentReference<Course>): Promise<Professor[]> {
    const userProfessorsCollectionRef = collection(this.firestore, `users/${this.userId}/professors`);
    const q = query(userProfessorsCollectionRef, where("courseRef", "==", courseRef));
    const querySnapshot = await getDocs(q);
    const professors: Professor[] = [];
    querySnapshot.forEach(doc => {
      const professor = doc.data() as Professor;
      professors.push(professor);
    });
    return professors;
  }

  createRefToCourse(courseId: string): DocumentReference<Course> {
    return doc(this.firestore, `users/${this.userId}/courses/${courseId}`) as DocumentReference<Course>;
  }
}
