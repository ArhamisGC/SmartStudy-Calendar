import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import Course from "../../interfaces/course.interface";
import Professor from "../../interfaces/professor.interface";
import { ProfessorService } from "../../services/professor.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-subject-viewer',
  templateUrl: './subject-viewer.component.html',
  styleUrls: ['./subject-viewer.component.css'],
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

export class SubjectViewerComponent implements OnInit, OnChanges {
  @Input() selectedCourse?: Course;
  @Output() close = new EventEmitter<void>();
  professors: Professor[] = [];

  constructor(private professorService: ProfessorService) {}

  ngOnInit(): void {
    this.loadProfessors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCourse'] && changes['selectedCourse'].currentValue) {
      this.loadProfessors();
    }
  }

  async loadProfessors() {
    if (this.selectedCourse?.id) {
      const courseRef = this.professorService.createRefToCourse(this.selectedCourse.id);
      this.professors = await this.professorService.getProfessorsByCourseRef(courseRef);
    }
  }


  closeDialog() {
    this.close.emit();
  }
}
