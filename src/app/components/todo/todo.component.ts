import { Component, OnInit } from '@angular/core';
import Task from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { animate, style, transition, trigger } from "@angular/animations";
import Course from '../../interfaces/course.interface';
import { CourseService } from '../../services/course.service';
import { DocumentReference } from 'firebase/firestore';

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
  filteredTasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskOrder: number = 1;
  newTaskPriority: number = 2;
  newTaskStatus: number = 0;
  showTaskBuilder: boolean = false;
  currentSort: 'order' | 'priority' = 'order';
  // Cursos
  cachedTasks: Task[] = [];
  courses: Course[] = [];
  selectedCourseColor: string | undefined = '';
  selectedCourseId: string = '';
  filterCourseBy: string = '';
  selectedFilterCourseId: string = '';

  constructor(private taskService: TaskService,
    protected courseService: CourseService
  ) { }

  ngOnInit(): void {
    console.log("oninit")
    this.loadCourses();
    this.loadTasksWithCourseNames();
    this.filterTasks()
  }

  loadTasksWithCourseNames() {
    console.log("loadtasksnames")
    this.taskService.getTasks().subscribe(tasks => {
      this.courseService.getAllCourses().subscribe(courses => {
        const coursesMap = new Map(courses.map(course => [course.id, course.name]));
        this.tasks = tasks.map(task => ({
          ...task,
          courseName: task.courseRef ? coursesMap.get(task.courseRef.id) : 'Sin asignatura'
        }));
        this.cachedTasks = [...tasks];
      });
    }
    )
  }

  loadCourses(): void {
    console.log("loadcourses")
    this.courseService.getAllCourses().subscribe(courses => this.courses = courses);
  }

  filterTasks(): void {
    console.log("filter")
    if (this.selectedFilterCourseId) {

      const filteredTasks = this.cachedTasks.filter(task => task.courseRef?.id === this.selectedFilterCourseId);

      this.tasks = filteredTasks;
    } else {

      this.tasks = [...this.cachedTasks];
    }
  }

  extractIdFromRef(ref: DocumentReference<Course>): string {
    return ref.id;
  }


  addTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Omit<Task, 'id'> = {
      title: this.newTaskTitle.trim(),
      order: this.newTaskOrder,
      priority: this.newTaskPriority,
      status: this.newTaskStatus,
      editing: false,
      courseRef: this.courseService.createRefToCourse(this.selectedCourseId)
    };

    this.taskService.addTask(newTask);
    this.clearForm();
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
    console.log("updatestatus")
    const newStatus = task.status === 1 ? 0 : 1;
    this.taskService.updateTask(task.id, { status: newStatus });
    task.status = newStatus;
    console.log(this.selectedFilterCourseId)
    this.filterTasks();
    console.log(this.tasks)
  }

  editTask(task: Task): void {
    task.editing = true;
  }

  sortTasks(tasks: Task[], sortBy: 'order' | 'priority', isAscending: boolean = true): Task[] {
    console.log("sortTasks")
    return tasks.sort((a, b) => {
      if (sortBy === 'priority') {

        const priorityComparison = isAscending ? a.priority - b.priority : b.priority - a.priority;
        if (a.priority === b.priority) {
          return a.order - b.order;
        }
        return priorityComparison;
      } else {
        if (a.order === b.order) {
          return a.priority - b.priority;
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
    console.log("updateTask")
    this.taskService.updateTask(task.id, {
      title: task.title,
      order: task.order,
      priority: task.priority,
      status: task.status,
      courseRef: this.courseService.createRefToCourse(this.selectedCourseId)
    });
    task.editing = false;
    this.fixDuplicateOrders(this.tasks);
  }

  cancelEdit(task: Task): void {
    task.editing = false;

  }

  toggleTaskBuilder() {
    this.showTaskBuilder = !this.showTaskBuilder;
  }

  trackByTasks(index: number, task: Task): any {
    return task.id;
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.status === 1).length;
  }
}
