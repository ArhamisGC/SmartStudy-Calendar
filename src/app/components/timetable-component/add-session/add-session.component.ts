import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import Course from '../../../interfaces/course.interface';
import ClassSession from '../../../interfaces/class-sesion.interface';
import { CourseService } from '../../../services/course.service';
import { ClassSessionService } from '../../../services/timetable.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css'],
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

export class AddSessionComponent implements OnInit {
  @Output() sessionAdded = new EventEmitter<ClassSession>();
  @Output() close = new EventEmitter<void>();

  sessionForm: FormGroup;
  courses: Course[] = [];
  showManageSubjectsModal: boolean = false;
  allSessions: ClassSession[] = [];


  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private classSessionService: ClassSessionService
  ) {
    this.sessionForm = this.fb.group({
      hourStart: ['', Validators.required],
      hourEnd: ['', Validators.required],
      selectedDay: ['', Validators.required],
      subject: ['', Validators.required],
      color: ['#000000']
    });
  }

  ngOnInit(): void {
    this.classSessionService.getAllSessions().subscribe(sessions => {
      this.allSessions = sessions;
    });
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  selectDay(day: string): void {
    this.sessionForm.get('selectedDay')?.setValue(day);
  }

  verifyOverlap(newSession: ClassSession): boolean {
    const newStart = newSession.start.toDate().getTime();
    const newEnd = newSession.end.toDate().getTime() - 1; // Permitir fin a inicio sin solapamiento

    return this.allSessions.filter(session => session.day === newSession.day).some(session => {
      const existingStart = session.start.toDate().getTime();
      const existingEnd = session.end.toDate().getTime() - 1;
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  }

  addSession(): void {
    if (this.sessionForm.valid) {
      const formValue = this.sessionForm.value;
      const startDate = this.combineDateAndTime(formValue.selectedDay, formValue.hourStart);
      const endDate = this.combineDateAndTime(formValue.selectedDay, formValue.hourEnd);

      const newSession: ClassSession = {
        start: Timestamp.fromDate(startDate),
        end: Timestamp.fromDate(endDate),
        subject: this.courseService.createRefToCourse(formValue.subject),
        day: formValue.selectedDay,
        color: formValue.color
      };

      if (endDate <= startDate) {
        alert("La hora de fin no puede ser anterior a la hora de inicio en el mismo día.");
        return;
      }

      if (!this.verifyOverlap(newSession)) {
        this.classSessionService.addClassSession(newSession).then(() => {
          this.sessionAdded.emit(newSession);
          this.sessionForm.reset();
          this.closeDialog();
        }).catch(error => {
          console.error('Error adding session:', error);
        });
      } else {
        alert('No se puede crear la sesión de clase porque se solapa con otra existente.');
      }
    } else {
      alert('Por favor, complete todos los campos de la sesión adecuadamente.');
    }
  }

  combineDateAndTime(day: string, time: string): Date {
    const date = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and milliseconds

    // Adjust to next occurrence of the day of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let currentDayIndex = date.getDay();
    let selectedDayIndex = daysOfWeek.indexOf(day);

    let daysToAdd = selectedDayIndex - currentDayIndex;
    if (daysToAdd < 0) daysToAdd += 7; // Ensure it's the next occurrence
    date.setDate(date.getDate() + daysToAdd);

    return date;
  }

  closeDialog(): void {
    this.close.emit();
  }

  manageSubjects(): void {
    this.showManageSubjectsModal = true;
  }

  closeManageSubjectsModal(): void {
    this.showManageSubjectsModal = false;
  }
}

