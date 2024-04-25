import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import ClassSession from "../../../interfaces/class-sesion.interface";
import {ClassSessionService} from "../../../services/timetable.service";
import { Timestamp } from "@angular/fire/firestore";
import {CourseService} from "../../../services/course.service";
import {catchError, of} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
  providers: [DatePipe]
})
export class TimetableComponent implements OnInit {
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  schedule: ClassSession[] = [];
  public uniqueTimes: string[] | undefined;
  showAddSessionModal: boolean = false;

  constructor(
    public datePipe: DatePipe,
    private classSessionService: ClassSessionService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadSessions();
  }
  loadSessions(): void {
    this.classSessionService.getClassSessions().subscribe((sessions: ClassSession[]) => {
      this.schedule = sessions;
      this.uniqueTimes = this.computeUniqueTimes();
      sessions.forEach((session, index) => {
        if (session.subject) {
          this.courseService.getCourseFromReference(session.subject)
            .pipe(
              catchError(error => {
                console.error('Failed to load course:', error);
                return of({ name: 'Error loading name' });
              })
            )
            .subscribe(course => {
              console.log(`Course loaded for session ${index}:`, course);
              this.schedule[index].subjectName = course.name;
              this.schedule = [...this.schedule];
            });
        } else {
          this.schedule[index].subjectName = 'Libre'; // Asignar 'Libre' si no hay curso
          this.schedule = [...this.schedule]; // Truco para actualizar la vista
        }
      });
    });
  }

  computeUniqueTimes(): string[] {
    const times = this.schedule
      .map(s => this.datePipe.transform(s.start.toDate(), 'shortTime'))
      .filter(time => time !== null) as string[];
    return [...new Set(times)];
  }

  getSessionsForDay(day: string): ClassSession[] {
    return this.schedule.filter(session => session.day === day);
  }

  addSession(): void {
    this.showAddSessionModal = true;
  }

  editSubject(index: number, newSubject: string): void {
  }

  deleteSubject(index: number): void {
    if (index >= 0 && index < this.schedule.length) {
      const session = this.schedule[index];
      const sessionId = session.id;
      const sessionTime = this.datePipe.transform(session.start.toDate(), 'shortTime');
      const dayOfWeek = this.translateDay(session.day);
      const confirmation = window.confirm(`¿Estás seguro de que quieres eliminar la sesión de ${session.subjectName} del ${dayOfWeek} a las ${sessionTime}?`);

      if (confirmation) {
        // @ts-ignore
        this.classSessionService.deleteClassSession(sessionId).then(() => {
          this.loadSessions();  // Reload the sessions after deletion
        });
      }
    }
  }

  translateDay(day: string): string {
    switch (day) {
      case 'Mon':
        return 'lunes';
      case 'Tue':
        return 'martes';
      case 'Wed':
        return 'miércoles';
      case 'Thu':
        return 'jueves';
      case 'Fri':
        return 'viernes';
      default:
        return day;
    }
  }

  isDarkColor(color: string): boolean {
    const rgb = this.hexToRgb(color);
    const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    return luminance < 128;
  }

  hexToRgb(hex: string): { r: number, g: number, b: number } {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  getSessionsForDayAndTime(day: string, time: string): ClassSession[] {
    return this.schedule.filter(session => session.day === day && this.datePipe.transform(session.start.toDate(), 'shortTime') === time);
  }

  openAddSessionModal(): void {
    this.showAddSessionModal = true;
  }

  closeAddSessionModal(): void {
    this.showAddSessionModal = false;
  }
}
