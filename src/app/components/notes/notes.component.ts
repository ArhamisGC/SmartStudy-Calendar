import { Component, OnInit } from '@angular/core';
import Note from '../../interfaces/note.interface';
import Course from '../../interfaces/course.interface';
import { NotesService } from '../../services/notes.service';
import { CourseService } from '../../services/course.service';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {DocumentReference} from "@angular/fire/firestore";
import {animate, style, transition, trigger} from "@angular/animations";
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
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

export class NotesComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  newNote: Note = {title: '', description: '',color:''};
  showForm: boolean = false;
  showColor:boolean = false;
  editingNoteId: string | undefined = undefined;
  private _searchText: string = '';
  courses: Course[] = [];
  selectedCourseColor: string | undefined = '';
  selectedCourseId: any;

  constructor(private notesService: NotesService, private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.loadNotesWithCourseNames();
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(courses => this.courses = courses);
  }

  loadNotesWithCourseNames(): void {
    this.notesService.getNotes().subscribe(notes => {
      this.courseService.getAllCourses().subscribe(courses => {
        const coursesMap = new Map(courses.map(course => [course.id, course.name]));
        this.notes = notes.map(note => ({
          ...note,
          courseName: note.courseRef ? coursesMap.get(note.courseRef.id) : 'Sin asignatura'
        }));
        this.filterNotes();
      });
    });
  }


  filterNotes(): void {
    this.filteredNotes = this.notes.filter(note =>
      note.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get searchText(): string {
    return this._searchText;
  }

  set searchText(value: string) {
    this._searchText = value;
    this.filterNotes();
  }

  toggleForm(note?: Note): void {
    this.showForm = !this.showForm;
    if (note) {
      this.editingNoteId = note.id;
      this.newNote = {...note};
      // Si la nota ya tiene una asignatura, establece el color correspondiente
      if(note.courseRef) {
        this.courseService.getCourseFromReference(note.courseRef).subscribe(course => {
          this.selectedCourseColor = course.color; // Asume que tu interfaz Course tiene un campo color
        });
      }
    } else {
      this.editingNoteId = undefined;
      this.newNote = {title: '', description: '', color: ''};
      this.selectedCourseColor = ''; // Resetear el color seleccionado
    }
  }

  submitNote(): void {
    if (this.selectedCourseId) {
      const courseRef = this.courseService.createRefToCourse(this.selectedCourseId);
      this.newNote.courseRef = courseRef;
    }

    if (this.editingNoteId) {
      // Actualizar una nota existente
      this.notesService.modifyNote(this.editingNoteId, this.newNote).then(() => {
        this.resetForm();
        this.loadNotesWithCourseNames(); // Recargar las notas para reflejar los cambios
      });
    } else {
      // Crear una nueva nota
      if (this.newNote.title && this.newNote.description) {
        this.notesService.addNote(this.newNote).then(() => {
          this.resetForm();
          this.loadNotesWithCourseNames(); // Recargar las notas para incluir la nueva
        });
      }
    }
  }

  deleteNote(noteId: string): void {
    this.notesService.deleteNote(noteId).then(() => {
      this.loadNotesWithCourseNames(); // Recargar las notas después de eliminar
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.showColor = false;
    this.newNote = {title: '', description: '',color:''};
    this.editingNoteId = undefined;
  }

  public createCourseRef(courseId: string | undefined) {
    if (courseId === undefined) {
      return;
    }
    return this.courseService.createRefToCourse(courseId);
  }

  getCourseNameObservable(courseRef: DocumentReference<Course>): Observable<string> {
    return this.courseService.getCourseFromReference(courseRef).pipe(
      map(course => course.name)
    );
  }
}
