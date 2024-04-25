import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import ClassSession from "../../../interfaces/class-sesion.interface";
import {ClassSessionService} from "../../../services/timetable.service";
import { Timestamp } from "@angular/fire/firestore";

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
    private classSessionService: ClassSessionService
  ) {}

  ngOnInit() {
    this.loadSessions();      // Load all sessions including the new test session
  }

  loadSessions(): void {
    this.classSessionService.getClassSessions().subscribe((sessions: ClassSession[]) => {
      this.schedule = sessions;
      this.uniqueTimes = this.computeUniqueTimes();
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
      const sessionId = this.schedule[index].id;
      // @ts-ignore
      this.classSessionService.deleteClassSession(sessionId).then(() => {
        this.loadSessions();  // Reload the sessions after deletion
      });
    }
  }

  openAddSessionModal(): void {
    this.showAddSessionModal = true;
  }

  closeAddSessionModal(): void {
    this.showAddSessionModal = false;
  }
}
