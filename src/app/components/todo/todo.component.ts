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
  showTaskBuilder: boolean = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = this.sortTasks(tasks);
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
    this.sortTasks(this.tasks);
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

  updatePriority(id: string, newPriority: number): void {
    this.taskService.updateTask(id, { priority: newPriority });
    this.fixDuplicateOrders(this.tasks);
  }

  updateStatus(task: Task): void {
    const newStatus = task.status === 1 ? 0 : 1; // Cambia el estado
    this.taskService.updateTask(task.id, { status: newStatus });
    task.status = newStatus;
  }

  editTask(task: Task): void {
    task.editing = true;  // Agrega la propiedad 'editing' a tu interfaz Task si aún no está.
  }

  sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.order - b.order);
  }

  fixDuplicateOrders(sortedTasks: Task[]): void {
    // Asumiendo que 'sortedTasks' ya está ordenada por 'order'.
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      if (sortedTasks[i].order === sortedTasks[i + 1].order) {
        // Encuentra el próximo valor de 'order' que no cause duplicidad.
        let nextUniqueOrder = sortedTasks[i].order;

        // Incrementa el 'order' hasta que encuentre una posición única.
        while (sortedTasks.some(task => task.order === nextUniqueOrder)) {
          nextUniqueOrder++;
        }

        // Asigna el nuevo valor de 'order' a la tarea actual para eliminar el duplicado.
        sortedTasks[i + 1].order = nextUniqueOrder;
      }
    }

    this.tasks = sortedTasks;
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
    this.sortTasks(this.tasks);
    this.fixDuplicateOrders(this.tasks);
  }

  cancelEdit(task: Task): void {
    task.editing = false;
    // Opcionalmente, podrías recargar la tarea desde Firebase para descartar los cambios no guardados.
  }

  toggleTaskBuilder() {
    this.showTaskBuilder = !this.showTaskBuilder;
  }

  // Implementar métodos adicionales según sea necesario
}
