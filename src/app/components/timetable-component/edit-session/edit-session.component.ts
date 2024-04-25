import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.css']
})
export class EditSessionComponent implements OnInit {
  editSessionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editSessionForm = this.fb.group({
      hourStart: ['', Validators.required],
      hourEnd: ['', Validators.required],
      selectedDay: ['', Validators.required],  // Almacenar el día seleccionado como un único valor
      color: ['#000000'],
    });
  }

  selectDay(day: string): void {
    this.editSessionForm.get('selectedDay')!.setValue(day);
  }

  onSubmit(): void {
    if (this.editSessionForm.valid) {
      console.log(this.editSessionForm.value);
      // Lógica para actualizar la sesión en el servidor
    }
  }

  cancelEdit(): void {
    console.log('Edición cancelada');
    // Lógica para cerrar el formulario o redirigir al usuario
  }
}
