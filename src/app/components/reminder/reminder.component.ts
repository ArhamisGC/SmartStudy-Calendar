import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import Reminder from '../../interfaces/reminder.interface';
import {user} from "@angular/fire/auth";
import { ReminderService } from '../../services/reminder.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit{
  // Base
  reminder: Reminder = { description: '', time: '', date: '' };
  reminders: Reminder[] = [];

  // Modales Cancelar
  showModal: boolean = false;
  currentIndex: number = -1;

  // Modales Editar
  editReminder: Reminder = { description: '', time: '', date: '' };
  showEditModal: boolean = false;
  editIndex: number = -1;

  // Mesajes de confirmación
  showMessageSuccess: boolean = false;
  showMessageError: boolean = false;
  formValid:boolean = true;
  errorMessage: string = '';

  // Gestión de los recordatorios
  sortOrder: string = 'creation';

  user$: Observable<User | undefined>;
  protected userData: any;

  constructor(private userService: UserService, private router: Router, private reminderService: ReminderService) {
    this.user$ = of(undefined);
  }

  ngOnInit(): void {
    // @ts-ignore
    this.userService.getUserData().subscribe(userData => {
      if (userData) {
        this.userData = userData;
      }
    });
    this.loadReminders();
  }

  loadReminders() {
    this.reminderService.getReminders().subscribe(reminders => {
      this.reminders = reminders;
    });
  }

  createReminder() {
    this.validateForm();
    if (this.formValid) {
      this.reminderService.addReminder(this.reminder).then(() => {
        this.showMessageSuccess = true;
        setTimeout(() => this.showMessageSuccess = false, 3000);
        this.loadReminders(); // Recarga los recordatorios después de añadir uno nuevo
        this.resetForm();
      }).catch(error => {
        console.error('Error al añadir recordatorio:', error);
        this.showMessageError = true;
        setTimeout(() => this.showMessageError = false, 3000);
      });
    } else {
      this.showMessageError = true;
      setTimeout(() => this.showMessageError = false, 3000);
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
      return;
    } else if (reminderDate < currentDate) {
      this.formValid = false;
      this.errorMessage = "La fecha y hora deben ser correctas";
    } else {
      this.errorMessage = "";
    }
  }

  // Alteración de datos

  formatDate(date: string): string {
    return date.split('-').reverse().join('-');
  }

  resetForm() {
    this.reminder = { description: '', time: '', date: '' };
  }

  // Gestión

  changeSortOrder(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value;
    this.sortReminders();
  }

  sortReminders() {
    if (this.sortOrder === 'alphabetical') {
      this.reminders.sort((a, b) => a.description.localeCompare(b.description));
    } else if (this.sortOrder === 'time') {
      this.reminders.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateA.getTime() - dateB.getTime();
      });
    } else {
    }
  }

  // Modales

  openModal(index: number): void {
    this.currentIndex = index;
    this.showModal = true;
  }

  cancelDeletion(): void {
    this.showModal = false;
    this.currentIndex = -1;
  }

  openEditModal(index: number): void {
    this.editIndex = index;
    this.editReminder = {...this.reminders[index]};
    this.showEditModal = true;
  }

  confirmEdit() {
    this.validateForm();
    if (this.formValid) {
      const reminderId = this.reminders[this.editIndex].id;
      if (typeof reminderId === 'string') {
        this.reminderService.modifyReminder(reminderId, this.editReminder).then(() => {
          this.showEditModal = false;
          this.loadReminders();
        }).catch(error => {
          console.error('Error al editar recordatorio:', error);
          this.showMessageError = true;
          setTimeout(() => this.showMessageError = false, 3000);
        });
      } else {
        console.error('ID del recordatorio no definido.');
      }
    } else {
      this.showMessageError = true;
      setTimeout(() => this.showMessageError = false, 3000);
    }
  }

  confirmDeletion() {
    if (this.currentIndex !== -1) {
      const reminderId = this.reminders[this.currentIndex].id;
      if (typeof reminderId === 'string') {
        this.reminderService.deleteReminder(reminderId).then(() => {
          this.showModal = false;
          this.loadReminders();
        }).catch(error => {
          console.error('Error al eliminar recordatorio:', error);
        });
      } else {
        console.error('ID del recordatorio no definido.');
      }
    }
  }

  cancelEdit(): void {
    this.showEditModal = false;
  }
}

