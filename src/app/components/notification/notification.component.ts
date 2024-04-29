import {Component, OnInit} from '@angular/core';
import { Notification } from '../../interfaces/notification.interface'
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }
  loadNotifications(): void {
    this.notificationsService.getAllNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }
  removeNotification(notificationId: string | undefined): void {
    if (notificationId) {
      this.notificationsService.deleteNotification(notificationId).then(() => {
        console.log('Notification deleted!');
        this.loadNotifications();
      }).catch(error => console.error('Error deleting notification:', error));
    } else {
      console.error('Attempted to delete a notification without an ID');
    }
  }
}
