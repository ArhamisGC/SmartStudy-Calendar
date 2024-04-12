import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../interfaces/user.interface";
import {Router} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
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

export class ProfileComponent implements OnInit {
  userData: User | null = null;
  selectedButton: string = 'Perfil';
  isListVisible: boolean = true;

  constructor(private router: Router,private userService: UserService) {}

  userEmail: string | null | undefined;
  ngOnInit(): void {
    // @ts-ignore
    this.userService.getUserData().subscribe(userData => {
      if (userData) {
        this.userData = userData;
      }
    });
  }
  toggleListVisibility(button: string) {
    this.selectedButton = button;
    this.isListVisible = button === 'Perfil';
  }

  Logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }
}
