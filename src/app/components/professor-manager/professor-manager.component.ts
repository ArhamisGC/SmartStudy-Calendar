import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Professor from '../../interfaces/professor.interface';
import Course from "../../interfaces/course.interface";
import { ProfessorService } from "../../services/professor.service";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-professor-manager',
  templateUrl: './professor-manager.component.html',
  styleUrls: ['./professor-manager.component.css'],
  animations: [
    trigger('dialog', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', animate('200ms ease-out')),
      transition('* => void', animate('200ms ease-in'))
    ])
  ]
})
export class ProfessorManagerComponent implements OnInit {
  professors: Professor[] = [];
  selectedProfessorIndex: number | null = null;
  @Input() course: Course | null = null;
  @Output() close = new EventEmitter<void>();
  showCreator: boolean = false;
  showEditor: boolean = false;
  editingProfessor: Professor | null = null;

  constructor(private professorService: ProfessorService) { }

  ngOnInit(): void {
    if (this.course && this.course.id) {
      this.loadProfessors();
    }
  }

  loadProfessors(): void {
    if (this.course && this.course.id) {
      const courseRef = this.professorService.createRefToCourse(this.course.id);
      this.professorService.getProfessorsByCourseRef(courseRef).then(professors => {
        this.professors = professors;
      }).catch(error => {
        console.error('Error al cargar los profesores del curso:', error);
      });
    }
  }

  selectProfessor(index: number): void {
    this.selectedProfessorIndex = index;
  }

  deleteProfessor(): void {
    if (this.selectedProfessorIndex !== null && this.professors[this.selectedProfessorIndex]) {
      const professor = this.professors[this.selectedProfessorIndex];
      if (professor && professor.id) {
        if (confirm('¿Estás seguro de que deseas eliminar a este profesor?')) {
          this.professorService.deleteProfessor(professor.id)
            .then(() => {
              if (this.selectedProfessorIndex !== null) {
                this.professors.splice(this.selectedProfessorIndex, 1);
                this.selectedProfessorIndex = null;
              }
            })
            .catch(error => {
            });
        }
      }
    }
  }

  addProfessor(): void {
    this.showCreator = true;
  }

  closeCreator(): void {
    this.showCreator = false;
    this.loadProfessors();
  }

  closeManager(): void {
    this.close.emit();
  }

  editProfessor(): void {
    if (this.selectedProfessorIndex !== null && this.professors[this.selectedProfessorIndex]) {
      this.editingProfessor = this.professors[this.selectedProfessorIndex];
      this.showEditor = true;
    }
  }

  closeEditor(): void {
    this.showEditor = false;
    this.editingProfessor = null;
    this.loadProfessors();
  }
}
