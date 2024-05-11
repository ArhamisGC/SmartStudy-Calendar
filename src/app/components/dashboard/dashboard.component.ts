import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import {user} from "@angular/fire/auth";
import {animate, style, transition, trigger} from "@angular/animations";
import Task from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskStatus } from '../../interfaces/typeOfTask.interface';
import { TaskPriority } from '../../interfaces/typeOfTask.interface';

@Component({
selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
  trigger('dialog', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.9)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
    ])
  ])
]
})

export class DashboardComponent implements OnInit {
  user$: Observable<User | undefined>;
  protected userData: any;
  showSubjectManager: boolean = false;
  protected userImage: String = "https://placehold.co/300x300";
  isDarkModeEnabled: boolean = false;

  tasks: Task[] = [];
  highCompletedPercentage = 0;
  mediumCompletedPercentage = 0;
  lowCompletedPercentage = 0;

  constructor(private userService: UserService, private router: Router, private taskService: TaskService) {
    this.user$ = of(undefined);
  }

  ngOnInit(): void {
    // @ts-ignore
    this.userService.getUserData().subscribe(userData => {
      if (userData) {
        this.userData = userData;
        if (userData.profilePicture !== null && userData.profilePicture !== undefined && userData.profilePicture !== ""
        ){
          this.userImage = userData.profilePicture;
        }

      }
    });

    this.isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    this.applyDarkMode();

    this.taskService.getTasks().subscribe(tasks => {
      const totalTasks = tasks.length;
      const highTasks = tasks.filter(task => task.priority === TaskPriority.High && task.status === TaskStatus.Completed).length;
      const mediumTasks = tasks.filter(task => task.priority === TaskPriority.Medium && task.status === TaskStatus.Completed).length;
      const lowTasks = tasks.filter(task => task.priority === TaskPriority.Low && task.status === TaskStatus.Completed).length;

      this.highCompletedPercentage = (highTasks / tasks.filter(task => task.priority === TaskPriority.High).length) * 100;
      this.mediumCompletedPercentage = (mediumTasks / tasks.filter(task => task.priority === TaskPriority.Medium).length) * 100;
      this.lowCompletedPercentage = (lowTasks / tasks.filter(task => task.priority === TaskPriority.Low).length) * 100;
    });
  }

  private applyDarkMode(): void {
    document.body.classList.toggle('dark-mode', this.isDarkModeEnabled);
    localStorage.setItem('darkMode', this.isDarkModeEnabled ? 'enabled' : 'disabled');
  }

  toggleDarkMode(): void {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;
    this.applyDarkMode();
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/logout']);
  }

  openSubjectManager(): void {
    this.showSubjectManager = true;
  }

  closeSubjectManager(): void {
    this.showSubjectManager = false;
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  protected readonly user = user;
}
