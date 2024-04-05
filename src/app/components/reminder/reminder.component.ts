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
  reminder: Reminder = { description: '', time: '', date: '' }; // CHANGED: Added date
  reminders: Reminder[] = []; // Array para almacenar los recordatorios

  submitted = false;
  formValid = true;

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
    this.submitted = true;
    this.validateForm();
    if (!this.formValid) return;

    console.log('Reminder creado:', this.reminder);
  }
  validateForm() {
    this.formValid = this.reminder.description.trim().length > 0 &&
      this.reminder.time.trim().length > 0 &&
      this.reminder.date.trim().length > 0;
  }
}

