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
    this.courseService.getAllCourses().subscribe((courses: Course[]) => {
      this.courses = courses;
    });
  }

  selectDay(day: string): void {
    this.sessionForm.get('selectedDay')?.setValue(day);
  }

  addSession(): void {
    if (this.sessionForm.valid) {
      const formValue = this.sessionForm.value;
      const startDate = this.combineDateAndTime(formValue.selectedDay, formValue.hourStart);
      const endDate = this.combineDateAndTime(formValue.selectedDay, formValue.hourEnd);
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      const classSession: ClassSession = {
        start: startTimestamp,
        end: endTimestamp,
        subject: this.courseService.createRefToCourse(formValue.subject),
        day: formValue.selectedDay,
        color: formValue.color
      };

      this.classSessionService.addClassSession(classSession).then(() => {
        this.sessionAdded.emit(classSession);
        this.sessionForm.reset();
        this.closeDialog();
      }).catch(error => {
      });
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

