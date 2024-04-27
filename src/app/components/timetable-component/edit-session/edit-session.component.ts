import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassSesion from "../../../interfaces/class-sesion.interface";
import { ClassSessionService } from "../../../services/timetable.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {Timestamp} from "@angular/fire/firestore";
import ClassSession from "../../../interfaces/class-sesion.interface";

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.css'],
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

export class EditSessionComponent implements OnInit, OnChanges {
  @Input() session: ClassSesion | null = null;
  @Output() onCancel = new EventEmitter<void>();

  editSessionForm!: FormGroup;
  allSessions: ClassSesion[] = [];

  constructor(
    private fb: FormBuilder,
    private classSessionService: ClassSessionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllSessions();
  }

  loadAllSessions(): void {
    this.classSessionService.getAllSessions().subscribe(sessions => {
      this.allSessions = sessions;
    }, error => {
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['session'] && changes['session'].currentValue) {
      this.initForm();
    }
  }

  initForm(): void {
    if (this.session) {
      const startDateTime = this.session.start.toDate();
      const endDateTime = this.session.end.toDate();

      const formattedStartHour = startDateTime.getHours().toString().padStart(2, '0');
      const formattedStartMinute = startDateTime.getMinutes().toString().padStart(2, '0');
      const formattedEndHour = endDateTime.getHours().toString().padStart(2, '0');
      const formattedEndMinute = endDateTime.getMinutes().toString().padStart(2, '0');

      this.editSessionForm = this.fb.group({
        hourStart: [`${formattedStartHour}:${formattedStartMinute}`, Validators.required],
        hourEnd: [`${formattedEndHour}:${formattedEndMinute}`, Validators.required],
        selectedDay: [this.session.day, Validators.required],
        color: [this.session.color || '', Validators.required]
      });
    }
  }

  selectDay(day: string): void {
    this.editSessionForm.get('selectedDay')?.setValue(day);
  }

  onSubmit(): void {
    if (this.editSessionForm.valid && this.session && this.session.id) {  // Comprobar que session y session.id no sean null
      const session = this.session; // Copia de this.session para asegurar la no-nullabilidad en el contexto actual

      const startHours = parseInt(this.editSessionForm.value.hourStart.split(':')[0]);
      const startMinutes = parseInt(this.editSessionForm.value.hourStart.split(':')[1]);
      const endHours = parseInt(this.editSessionForm.value.hourEnd.split(':')[0]);
      const endMinutes = parseInt(this.editSessionForm.value.hourEnd.split(':')[1]);
      const selectedDay = this.editSessionForm.value.selectedDay;

      const today = new Date();
      const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(selectedDay);
      const currentDayIndex = today.getDay();
      const daysToAdd = (dayIndex - currentDayIndex + 7) % 7;
      today.setDate(today.getDate() + daysToAdd);

      const newStartDate = new Date(today);
      newStartDate.setHours(startHours, startMinutes, 0, 0);
      const newEndDate = new Date(today);
      newEndDate.setHours(endHours, endMinutes, 0, 0);

      if (newEndDate < newStartDate) {
        alert("La hora de fin no puede ser anterior a la hora de inicio en el mismo día.");
        return;
      }

      const updatedStart = Timestamp.fromDate(newStartDate);
      const updatedEnd = Timestamp.fromDate(newEndDate);

      const updatedSession: ClassSession = {
        ...session,
        start: updatedStart,
        end: updatedEnd,
        day: selectedDay,
        color: this.editSessionForm.value.color
      };

      const sessionsForOverlapCheck = this.allSessions.filter(s => s.id !== session.id); // Ahora es seguro usar session.id

      if (!this.verifyOverlap(updatedSession, sessionsForOverlapCheck)) {
        if (session.id != null) {
          this.classSessionService.updateClassSession(session.id, updatedSession)
            .then(() => {
              this.cancelEdit();
            })
            .catch(error => {
              console.error('Error updating session:', error);
            });
        }
      } else {
        alert('No se puede actualizar la sesión de clase porque se solapa con otra existente.');
      }
    } else {
      alert("Por favor, rellene todos los campos.");
    }
  }

  verifyOverlap(newSession: ClassSession, sessions: ClassSession[]): boolean {
    const newStart = newSession.start.toDate().getTime();
    const newEnd = newSession.end.toDate().getTime() - 1;
    return sessions.some(session => {
      const existingStart = session.start.toDate().getTime();
      const existingEnd = session.end.toDate().getTime() - 1;
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  }

  cancelEdit(): void {
    this.onCancel.emit();
  }
}
