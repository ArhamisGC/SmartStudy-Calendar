import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Professor from '../../interfaces/professor.interface';
import Course from "../../interfaces/course.interface";
import {ProfessorService} from "../../services/professor.service";
import { CourseService } from "../../services/course.service";
import {emit} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";

@Component({
  selector: 'app-professor-editor',
  templateUrl: './professor-editor.component.html',
  styleUrls: ['./professor-editor.component.css']
})
export class ProfessorEditorComponent implements OnInit {
  professorForm: FormGroup;
  @Output() close = new EventEmitter<void>();
  @Input() professor: Professor | null = null;

  constructor(
    private fb: FormBuilder,
    private professorService: ProfessorService,
    private courseService: CourseService
  ) {
    this.professorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.professor) {
      this.professorForm.patchValue(this.professor);
    }
  }

  closeDialog(): void {
    this.close.emit();
  }

  saveProfessor(): void {
    if (this.professorForm.valid) {
      if (this.professor && this.professor.id) {
        const updatedProfessorData: Professor = {
          ...this.professor,
          ...this.professorForm.value
        };

        this.professorService.updateProfessor(this.professor.id, updatedProfessorData)
          .then(() => {
            this.closeDialog();
          })
          .catch(error => {
            alert('No se pudo actualizar el profesor.');
          });
      } else {
        alert('No se pudo identificar al profesor para actualizar.');
      }
    } else {
      alert('Por favor, asegúrate de que todos los campos estén correctamente llenos.');
    }
  }
}
