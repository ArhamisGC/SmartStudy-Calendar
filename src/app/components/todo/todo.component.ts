import { Component, OnInit } from '@angular/core';
import Task from '../../interfaces/task.interface'; // Asegúrate de que la ruta sea correcta
import { TaskService } from '../../services/task.service'; // Asegúrate de que la ruta al servicio es correcta

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskOrder: number = 1; // Establece un valor predeterminado para el orden.
  newTaskPriority: number = 2; // Prioridad media por defecto.
  newTaskStatus: number = 0; // Estado pendiente por defecto.

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Omit<Task, 'id'> = {
      title: this.newTaskTitle.trim(),
      order: this.newTaskOrder,
      priority: this.newTaskPriority,
      status: this.newTaskStatus,
      editing: false
    };

    this.taskService.addTask(newTask);
    this.clearForm();
  }

  clearForm(): void {
    this.newTaskTitle = '';
    this.newTaskOrder = 1;
    this.newTaskPriority = 2;
    this.newTaskStatus = 0;
  }

  removeTask(id: string): void {
    this.taskService.removeTask(id);
  }

  updatePriority(id: string, newPriority: number): void {
    this.taskService.updateTask(id, { priority: newPriority });
  }

  updateStatus(id: string, newStatus: number): void {
    this.taskService.updateTask(id, { status: newStatus });
  }

  editTask(task: Task): void {
    task.editing = true;  // Agrega la propiedad 'editing' a tu interfaz Task si aún no está.
  }
  
  updateTask(task: Task): void {
    // Aquí iría la lógica para actualizar la tarea en Firebase.
    // Por simplicidad, asumiremos que ya tienes implementado 'updateTask' en tu service.
    this.taskService.updateTask(task.id, {
      title: task.title,
      order: task.order,
      priority: task.priority,
      status: task.status
    });
    task.editing = false;
  }
  
  cancelEdit(task: Task): void {
    task.editing = false;
    // Opcionalmente, podrías recargar la tarea desde Firebase para descartar los cambios no guardados.
  }
  // Implementar métodos adicionales según sea necesario
}