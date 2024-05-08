import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDarkModeEnabled: boolean = false;

  constructor(private router: Router, private userService: UserService) {}

  // Inicio de la sección del modo oscuro más añadido en el ngOnInit

  ngOnInit(): void {
    this.isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    this.applyDarkMode();
  }

  private applyDarkMode(): void {
    document.body.classList.toggle('dark-mode', this.isDarkModeEnabled);
  }

  toggleDarkMode(): void {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;
    this.applyDarkMode();
    localStorage.setItem('darkMode', this.isDarkModeEnabled ? 'enabled' : 'disabled');
  }

  // Fin de la sección del modo oscuro más añadido en el ngOnInit

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/logout']);
  }
}
