import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import ClassSession from "../../../interfaces/class-sesion.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Course from "../../../interfaces/course.interface";
import {CourseService} from "../../../services/course.service";
import {ClassSessionService} from "../../../services/timetable.service";
import {Timestamp} from "@angular/fire/firestore";
import {animate, style, transition, trigger} from "@angular/animations";
import {catchError, of} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-to-find',
  templateUrl: './to-find.component.html',
  styleUrl: './to-find.component.css',
  animations: [
    trigger('dialog', [
      transition(':enter', [
        style({opacity: 0, transform: 'scale(0.9)'}),
        animate('200ms ease-out', style({opacity: 1, transform: 'scale(1)'})),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({opacity: 0, transform: 'scale(0.9)'}))
      ])
    ])
  ]
})
export class ToFindComponent implements OnInit {
  @Output() sessionAdded = new EventEmitter<ClassSession>();
  @Output() close = new EventEmitter<void>();

  public uniqueTimes: string[] | undefined;
  sessionForm: FormGroup;
  courses: Course[] = [];
  allSessions: ClassSession[] = [];
  schedule: ClassSession[] = [];
  dayss: string = '';
  libres: string[] = [];
  nuevo: boolean = false;


  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private classSessionService: ClassSessionService,
    public datePipe: DatePipe,
  ) {
    this.sessionForm = this.fb.group({
      hourStart: ['', Validators.required],
      hourEnd: ['', Validators.required],
      selectedDay: ['', Validators.required],
      subject: ['', Validators.required],
      color: ['#000000']
    });
  }

  ngOnInit(): void {
    this.loadSessions();
    this.classSessionService.getAllSessions().subscribe(sessions => {
      this.allSessions = sessions;
    });
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  loadSessions(): void {
    this.classSessionService.getClassSessions().subscribe((sessions: ClassSession[]) => {
      this.schedule = sessions;
      this.uniqueTimes = this.computeUniqueTimes();
      sessions.forEach((session, index) => {
        if (session.subject) {
          this.courseService.getCourseFromReference(session.subject)
            .pipe(
              catchError(error => {
                console.error('Failed to load course:', error);
                return of({name: 'Error loading name'});
              })
            )
            .subscribe(course => {
              this.schedule[index].subjectName = course.name;
              this.schedule = [...this.schedule];
            });
        } else {
          this.schedule[index].subjectName = 'Libre'; // Asignar 'Libre' si no hay curso
          this.schedule = [...this.schedule]; // Truco para actualizar la vista
        }
      });
    });
  }

  computeUniqueTimes(): string[] {
    const times = this.schedule
      .map(s => this.datePipe.transform(s.start.toDate(), 'shortTime'))
      .filter(time => time !== null) as string[];
    return [...new Set(times)];
  }

  selectDay(day: string): void {
    this.dayss = day;
    this.sessionForm.get('selectedDay')?.setValue(day);
  }

  findFreeSlots(): void {
    let sessionsForSelectedDay = this.schedule.filter(session => session.day === this.dayss);

    // Ordena las sesiones por hora de inicio
    sessionsForSelectedDay.sort((a, b) => a.start.toDate().getTime() - b.start.toDate().getTime());

    const freeSlots = [];

    // Encuentra los espacios libres entre las sesiones
    for (let i = 0; i < sessionsForSelectedDay.length - 1; i++) {
      const currentSessionEnd = sessionsForSelectedDay[i].end.toDate();
      const nextSessionStart = sessionsForSelectedDay[i + 1].start.toDate();
      let tiempo = nextSessionStart.getHours() - currentSessionEnd.getHours();
      if(tiempo>= 1){
        if (currentSessionEnd < nextSessionStart) {
          freeSlots.push({
            start: currentSessionEnd,
            end: nextSessionStart
          });
        }
      }
    }
    this.nuevo = true;
    let nueva = '';
    if (sessionsForSelectedDay.length == 0) {
      nueva = 'No tienes clases';
      this.libres.push(nueva);
    } else {
      if (freeSlots.length == 0) {
        nueva = 'No tienes horas libres';
        this.libres.push(nueva);
      } else {
        for (let i = 0; i < freeSlots.length; i++) {
          nueva = 'Empieza a las ' + freeSlots[i].start.getHours() + ':' + freeSlots[i].start.getMinutes() + ' y termina a las ' + freeSlots[i].end.getHours() + ':' + freeSlots[i].end.getMinutes() + '\n';
          this.libres.push(nueva);
        }
      }
    }
  }

  closeDialog(): void {
    this.close.emit();
  }

  closeFree(): void {
    this.nuevo = false;
    this.libres = [];
  }
}


