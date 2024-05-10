import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import {user} from "@angular/fire/auth";
import {animate, style, transition, trigger} from "@angular/animations";

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
  private userImage: String = "https://placehold.co/600x400";
  isDarkModeEnabled: boolean = false;

  constructor(private userService: UserService, private router: Router) {
    this.user$ = of(undefined);
  }

  ngOnInit(): void {
    // @ts-ignore
    this.userService.getUserData().subscribe(userData => {
      if (userData) {
        this.userData = userData;
        this.userImage = userData.profilePicture;
      }
    });
    this.isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    this.applyDarkMode();
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

  protected readonly user = user;
}
