import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from "../../services/event.service";
import { Subscription } from 'rxjs';
import Event from "../../interfaces/event.interface";
import { Timestamp } from '@angular/fire/firestore';
import {animate, style, transition, trigger} from "@angular/animations";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
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

export class CalendarComponent implements OnInit, OnDestroy {
  weeks: (Timestamp | null)[][] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth: Timestamp = Timestamp.fromDate(new Date());
  today: Timestamp = Timestamp.now();
  monthTransition: string = '';
  events: Event[] = [];
  selectedEvent?: Event;
  selectedEvents: Event[] = [];
  showEventCreator: boolean = false;
  showEventViewer: boolean = false;
  private eventsSub: Subscription = new Subscription();

  constructor(private eventsService: EventsService, private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.requestNotificationPermission();
    this.generateCalendar();
    this.loadEvents();
    setInterval(() => this.checkAndNotifyEvents(), 30000);
  }

  requestNotificationPermission(): void {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Permission for notifications granted");
      } else {
        console.log("Permission for notifications denied");
      }
    });
  }

  ngOnDestroy(): void {
    this.eventsSub.unsubscribe();
  }

  loadEvents(): void {
    this.eventsSub = this.eventsService.getEventsWithCourse().subscribe(events => {
      this.events = events.map(event => ({
        ...event,
        notified: localStorage.getItem(`notified_${event.id}`) === 'true'
      }));
    });
  }


  generateCalendar(): void {
    const year = this.currentMonth.toDate().getFullYear();
    const month = this.currentMonth.toDate().getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates: (Timestamp | null)[] = Array(firstDayOfMonth).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(Timestamp.fromDate(new Date(year, month, i)));
    }
    while (dates.length % 7 !== 0) {
      dates.push(null);
    }
    this.weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
      this.weeks.push(dates.slice(i, i + 7));
    }
  }

  changeMonth(delta: number): void {
    const newMonthDate = this.currentMonth.toDate();
    newMonthDate.setMonth(newMonthDate.getMonth() + delta);
    this.currentMonth = Timestamp.fromDate(newMonthDate);
    this.monthTransition = 'fade-out';
    setTimeout(() => {
      this.generateCalendar();
      this.monthTransition = 'fade-in';
      setTimeout(() => {
        this.monthTransition = '';
      }, 500);
    }, 500);
  }

  isToday(date: Timestamp | null): boolean {
    if (!date) return false;
    return date.toDate().toDateString() === this.today.toDate().toDateString();
  }

  isSameDay(date1: Timestamp, date2: Timestamp): boolean {
    return date1.toDate().toDateString() === date2.toDate().toDateString();
  }

  selectEvent(event: Event): void {
    this.selectedEvent = event;
  }

  onViewerClose(): void {
    this.selectedEvent = undefined;
  }

  createEvent(): void {
    this.showEventCreator = true;
  }

  onEventCreated(event: any): void {
    this.showEventCreator = false;
  }

  dayClicked(date: Timestamp | null): void {
    if (!date) return;
    const eventsOfDay = this.events.filter(event => this.isSameDay(event.date, date));
    if (eventsOfDay.length > 0) {
      this.selectedEvents = eventsOfDay;
      this.showEventViewer = true;
    }
  }

  openEventViewer(events: Event[]): void {
    this.selectedEvents = events;
    this.showEventViewer = true;
  }
  hasEvents(date: Timestamp | null): boolean {
    return date ? this.events.some(event => this.isSameDay(event.date, date)) : false;
  }


  handleEventSelected(selectedEvent: Event): void {
    this.selectedEvent = selectedEvent;
    this.showEventViewer = false;
  }

  onEventViewerClose(): void {
    this.selectedEvent = undefined;
    this.showEventViewer = false;
  }


  closeDialog(): void {
    this.showEventCreator = false;
    this.showEventViewer = false;
  }

  checkAndNotifyEvents(): void {
    const now = new Date();
    this.events.forEach(event => {
      const eventDate = event.date.toDate();
      if (eventDate > now && !event.notified) {
        this.sendNotification(event);
        event.notified = true;
      }
    });
  }
  sendNotification(event: Event): void {
    if (Notification.permission === "granted") {
      const notification = new Notification("Recordatorio de evento", {
        body: `${event.name}`,
        icon: '/img/icon_square.png'
      });
      localStorage.setItem(`notified_${event.id}`, 'true');
      event.notified = true;
      notification.onclick = () => {
        window.focus();
      };

      this.notificationsService.addNotification({
        id: '',
        title: "Recordatorio de evento",
        info: event.name,
        time: event.date.toMillis()
      }).then(() => {
        console.log('Notification added to Firestore');
      }).catch(error => {
        console.error('Error adding notification to Firestore:', error);
      });
    }
  }
}
