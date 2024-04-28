import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Professor from '../../interfaces/professor.interface';
import Course from "../../interfaces/course.interface";
import {ProfessorService} from "../../services/professor.service";
import { CourseService } from "../../services/course.service";
import {emit} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";

@Component({
  selector: 'app-professor-creator',
  templateUrl: './professor-creator.component.html',
  styleUrls: ['./professor-creator.component.css']
})
export class ProfessorCreatorComponent implements OnInit {
  professorForm: FormGroup;
  @Input() course: Course | null = null;
  @Output() close = new EventEmitter<void>();


  constructor(
    private fb: FormBuilder,
    private professorService: ProfessorService,
    private courseService: CourseService // Agrega esta línea para inyectar el servicio
  ) {
    this.professorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }


  ngOnInit(): void {
    if (!this.course) {
      console.error("No course provided to professor creator.");
    }
  }

  saveProfessor(): void {
    if (!this.professorForm.valid) {
      if (this.professorForm.controls['name'].errors) {
        alert('Es necesario introducir un nombre.');
      }
      if (this.professorForm.controls['email'].errors) {
        if (this.professorForm.controls['email'].errors['required']) {
          alert('El email es requerido.');
        } else if (this.professorForm.controls['email'].errors['email']) {
          alert('Por favor, introduce una dirección de correo válida.');
        }
      }
      return;
    }

    if (this.course && this.course.id) {
      const courseRef = this.courseService.createRefToCourse(this.course.id);
      const newProfessor: Professor = {
        ...this.professorForm.value,
        courseRef: courseRef
      };

      this.professorService.addProfessor(newProfessor).then(() => {
        this.closeDialog();
      }).catch(error => {
      });
    } else {
      alert("Datos de curso inválidos.");
    }
  }

  closeDialog(): void {
    this.close.emit();
  }

}
