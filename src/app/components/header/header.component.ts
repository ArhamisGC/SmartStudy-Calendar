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
  constructor(private router: Router,private userService: UserService) {}

  navigateTo(path: string): void {
    this.router.navigate([path]);
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
