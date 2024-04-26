import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassSesion from "../../../interfaces/class-sesion.interface";
import { ClassSessionService } from "../../../services/timetable.service";
import {animate, style, transition, trigger} from "@angular/animations";

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

  constructor(
    private fb: FormBuilder,
    private classSessionService: ClassSessionService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['session'] && changes['session'].currentValue) {
      this.initForm();
    }
  }

  initForm(): void {
    if (this.session) {
      this.editSessionForm = this.fb.group({
        hourStart: [this.session.start.toDate().toISOString().substring(11, 16), Validators.required],
        hourEnd: [this.session.end.toDate().toISOString().substring(11, 16), Validators.required],
        selectedDay: [this.session.day, Validators.required],
        color: [this.session.color || '', Validators.required]
      });
    }
  }

  selectDay(day: string): void {
    this.editSessionForm.get('selectedDay')?.setValue(day);
  }

  onSubmit(): void {
    if (this.editSessionForm.valid && this.session && this.session.id !== undefined) {
      const updatedSession: ClassSesion = {
        ...this.session,
        ...this.editSessionForm.value,
        start: new Date(this.session.start.toDate().setHours(parseInt(this.editSessionForm.value.hourStart.split(':')[0]), parseInt(this.editSessionForm.value.hourStart.split(':')[1]))),
        end: new Date(this.session.end.toDate().setHours(parseInt(this.editSessionForm.value.hourEnd.split(':')[0]), parseInt(this.editSessionForm.value.hourEnd.split(':')[1])))
      };

      updatedSession.day = this.editSessionForm.value.selectedDay;

      this.classSessionService.updateClassSession(this.session.id, updatedSession)
        .then(() => {
          console.log('Session updated:', updatedSession);
          this.cancelEdit();
        })
        .catch(error => {
          console.error('Error updating session:', error);
        });
    }
  }




  cancelEdit(): void {
    this.onCancel.emit();
  }
}
