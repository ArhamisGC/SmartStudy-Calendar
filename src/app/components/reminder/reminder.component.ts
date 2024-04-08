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
  errorMessage: string = '';

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
    this.validateForm();
    if (this.formValid) {
      this.reminders.push({...this.reminder}); // Añade el recordatorio
      this.showMessageSuccess = true;
      setTimeout(() => this.showMessageSuccess = false, 3000); // Oculta el mensaje de éxito después de 3 segundos
      this.resetForm();
    } else {
      this.showMessageError = true;
      setTimeout(() => this.showMessageError = false, 3000); // Oculta el mensaje de error después de 3 segundos
    }
  }
  validateForm() {
    const currentDate = new Date();
    const reminderDate = new Date(this.reminder.date + 'T' + this.reminder.time);

    this.formValid = this.reminder.description.trim().length > 0 &&
      this.reminder.time.trim().length > 0 &&
      this.reminder.date.trim().length > 0;

    if (!this.formValid) {
      this.errorMessage = "Por favor, rellena todos los campos.";
      return; // Termina la ejecución si algún campo está vacío
    } else if (reminderDate < currentDate) {
      this.formValid = false;
      this.errorMessage = "La fecha y hora deben ser correctas";
    } else {
      this.errorMessage = ""; // No hay errores
    }

    // Note que el mostrar u ocultar el mensaje de error se maneja en las funciones de creación/edición
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

  confirmEdit() {
    this.validateForm();
    if (this.formValid) {
      if (this.editIndex !== -1) {
        this.reminders[this.editIndex] = {...this.editReminder}; // Actualiza el recordatorio
        this.showEditModal = false;
      }
    } else {
      this.showMessageError = true;
      setTimeout(() => this.showMessageError = false, 3000); // Oculta el mensaje de error después de 3 segundos
    }
  }

  cancelEdit(): void {
    this.showEditModal = false;
  }
}

