import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import Reminder from '../../interfaces/reminder.interface';
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit{
  //Base
  reminder: Reminder = { description: '', time: '', date: '' }; // CHANGED: Added date
  reminders: Reminder[] = []; // Array para almacenar los recordatorios

  // Modales Cancelar
  showModal: boolean = false;
  currentIndex: number = -1; // Index del recordatorio actual para eliminar

  // Modales Editar
  editReminder: Reminder = { description: '', time: '', date: '' };
  showEditModal: boolean = false;
  editIndex: number = -1; // Para saber cuál recordatorio estamos editando

  //Mesajes de confirmación
  showMessageSuccess: boolean = false;
  showMessageError: boolean = false;
  formValid:boolean = true;

  user$: Observable<User | undefined>;
  protected userData: any;

  constructor(private userService: UserService, private router: Router) {
    this.user$ = of(undefined);
  }

  ngOnInit(): void {
    // @ts-ignore
    this.userService.getUserData().subscribe(userData => {
      if (userData) {
        this.userData = userData;
      }
    });
  }

  createReminder() {
    this.validateForm()
    if (this.formValid) {
      this.reminders.push({...this.reminder});
      this.showMessageSuccess = true;
      this.showMessageError = false;
      setTimeout(() => this.showMessageSuccess = false, 3000); // El mensaje de éxito desaparece después de 3 segundos
      //this.resetForm();
    } else {
      this.showMessageError = true;
      setTimeout(() => this.showMessageError = false, 3000); // El mensaje de error desaparece después de 3 segundos
    }
  }
  validateForm()  {
    this.formValid = this.reminder.description.trim().length > 0 &&
      this.reminder.time.trim().length > 0 &&
      this.reminder.date.trim().length > 0;
  }
  resetForm() {
    this.reminder = { description: '', time: '', date: '' };
  }

  openModal(index: number): void {
    this.currentIndex = index;
    this.showModal = true;
  }

  confirmDeletion(): void {
    if (this.currentIndex !== -1) {
      this.reminders.splice(this.currentIndex, 1);
      this.showModal = false;
      this.currentIndex = -1; // Restablece el índice
    }
  }

  cancelDeletion(): void {
    this.showModal = false;
    this.currentIndex = -1; // Restablece el índice
  }

  // Métodos para manejar el modal de edición
  openEditModal(index: number): void {
    this.editIndex = index;
    this.editReminder = {...this.reminders[index]}; // Copia el recordatorio a editar
    this.showEditModal = true;
  }

  confirmEdit(): void {
    if (this.editIndex !== -1) {
      this.reminders[this.editIndex] = {...this.editReminder}; // Actualiza el recordatorio
      this.showEditModal = false;
    }
  }

  cancelEdit(): void {
    this.showEditModal = false;
  }
}

