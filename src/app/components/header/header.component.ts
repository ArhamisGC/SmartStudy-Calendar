import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  showNotifications = false;
  showWeather: boolean = false;

  isDarkModeEnabled: boolean = false;
  showMenu: boolean = false;

  constructor(private router: Router, private userService: UserService) {}

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

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.showMenu = false; // Close the menu after navigation
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/logout']);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications; // Cambia la visibilidad del componente de notificaciones
  }


  toggleWeather(): void {
    this.showWeather = !this.showWeather; // Cambia la visibilidad del componente de tiempo
  }
}

