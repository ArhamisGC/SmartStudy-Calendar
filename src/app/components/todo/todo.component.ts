import { Component, OnInit } from '@angular/core';
import Task from '../../interfaces/task.interface'; // Asegúrate de que la ruta sea correcta
import { TaskService } from '../../services/task.service';
import {animate, style, transition, trigger} from "@angular/animations"; // Asegúrate de que la ruta al servicio es correcta

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
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

export class TodoComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskOrder: number = 1; // Establece un valor predeterminado para el orden.
  newTaskPriority: number = 2; // Prioridad media por defecto.
  newTaskStatus: number = 0; // Estado pendiente por defecto.
  showTaskBuilder: boolean = false;
  currentSort: 'order' | 'priority' = 'order';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = this.sortTasks(tasks, this.currentSort);
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
    // this.sortTasks(this.tasks);
    this.fixDuplicateOrders(this.tasks);
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

  updateStatus(task: Task): void {
    const newStatus = task.status === 1 ? 0 : 1; // Cambia el estado
    this.taskService.updateTask(task.id, { status: newStatus });
    task.status = newStatus;
  }

  editTask(task: Task): void {
    task.editing = true;  // Agrega la propiedad 'editing' a tu interfaz Task si aún no está.
  }

  sortTasks(tasks: Task[], sortBy: 'order' | 'priority', isAscending: boolean = true): Task[] {
    return tasks.sort((a, b) => {
      if (sortBy === 'priority') {
        // Cuando sortBy es 'priority', comprueba si es ascendente o descendente
        const priorityComparison = isAscending ? a.priority - b.priority : b.priority - a.priority;
        if (a.priority === b.priority) {
          return a.order - b.order; // Siempre subordenar por 'order' ascendente si 'priority' es igual
        }
        return priorityComparison;
      } else { // Default to sorting by 'order'
        if (a.order === b.order) {
          return a.priority - b.priority; // Suborden por 'priority' ascendente si 'order' es igual
        }
        return a.order - b.order;
      }
    });
  }
  

  onSortChange(sortBy: 'order' | 'priority', isAscending: boolean = true): void {
    this.currentSort = sortBy;
    this.tasks = this.sortTasks(this.tasks, sortBy, isAscending);
  }

  fixDuplicateOrders(sortedTasks: Task[]): void {
    // Asumiendo que 'sortedTasks' ya está ordenada por 'order'.
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      if (sortedTasks[i].order === sortedTasks[i + 1].order) {
        let nextUniqueOrder = sortedTasks[i].order;
        while (sortedTasks.some(task => task.order === nextUniqueOrder)) {
          nextUniqueOrder++;
        }
        sortedTasks[i + 1].order = nextUniqueOrder;
      }
    }
    this.tasks = sortedTasks;
  }

  updateTask(task: Task): void {
    this.taskService.updateTask(task.id, {
      title: task.title,
      order: task.order,
      priority: task.priority,
      status: task.status
    });
    task.editing = false;
    // this.sortTasks(this.tasks);
    this.fixDuplicateOrders(this.tasks);
  }

  cancelEdit(task: Task): void {
    task.editing = false;
    // Opcionalmente, podrías recargar la tarea desde Firebase para descartar los cambios no guardados.
  }

  toggleTaskBuilder() {
    this.showTaskBuilder = !this.showTaskBuilder;
  }

  trackByTasks(index: number, task: Task): any {
    return task.id; // Usamos el ID de la tarea como un identificador único
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.status === 1).length;
  }
}
