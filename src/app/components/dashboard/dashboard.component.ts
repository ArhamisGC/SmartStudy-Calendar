import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import {user} from "@angular/fire/auth";
import {animate, style, transition, trigger} from "@angular/animations";
import Task from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

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

  isDarkModeEnabled: boolean = false;

  tasks: Task[] = [];
  completionPercentage = 0;

  constructor(private userService: UserService, private router: Router, private taskService: TaskService) {
    this.user$ = of(undefined);
  }

  ngOnInit(): void {
    // @ts-ignore
    this.userService.getUserData().subscribe(userData => {
      if (userData) {
        this.userData = userData;
      }
    });

    this.isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    this.applyDarkMode();

    this.taskService.getTasks().subscribe(tasks => {
      const totalWeight = tasks.reduce((acc, task) => acc + this.getPriorityWeight(task.priority), 0);
      const completedWeight = tasks.reduce((acc, task) => {
        return acc + (task.status === 1 ? this.getPriorityWeight(task.priority) : 0);
      }, 0);

      this.completionPercentage = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
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

  private getPriorityWeight(priority: TaskPriority): number {
    switch (priority) {
      case tas: // Assuming 1 is High
        return 0.6;
      case TaskPriority.Medium: // Assuming 2 is Medium
        return 0.3;
      case TaskPriority.Low: // Assuming 3 is Low
        return 0.1;
      default:
        return 0.1; // Default to Low if undefined
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
