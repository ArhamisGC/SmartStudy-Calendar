import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import ClassSession from '../../../interfaces/class-sesion.interface';
import { CourseService } from '../../../services/course.service';
import Course from '../../../interfaces/course.interface';
import { DocumentReference } from "@angular/fire/firestore";

@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.css'],
  providers: [DatePipe]
})
export class ViewSessionComponent implements OnInit {
  @Input() session: ClassSession | null = null;
  public startTime: string | null = null;
  public endTime: string | null = null;
  public selectedCourse?: Course;
  public showSubjectViewer: boolean = false; // No mostrar por defecto

  @Output() close = new EventEmitter<void>();

  constructor(private datePipe: DatePipe, private courseService: CourseService) {}

  ngOnInit(): void {
    if (this.session) {
      this.startTime = this.session.start ? this.datePipe.transform(this.session.start.toDate(), 'shortTime') : null;
      this.endTime = this.session.end ? this.datePipe.transform(this.session.end.toDate(), 'shortTime') : null;
    }
  }

  loadCourseDetails(): void {
    if (this.session?.subject) {
      this.courseService.getCourseFromReference(this.session.subject as DocumentReference<Course>).subscribe({
        next: (course) => {
          this.selectedCourse = course;
          this.showSubjectViewer = true;
        },
        error: (error) => {
          console.error('Error loading course:', error);
          alert('Failed to load course details.');
        }
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  closeSubjectViewer(): void {
    this.showSubjectViewer = false;
  }
}
