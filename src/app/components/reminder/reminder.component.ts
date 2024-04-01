import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit{
  reminder = { description: '', time: '' };
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
    console.log(this.reminder);
    // Here you would add logic to save the reminder to Firebase
  }
}
