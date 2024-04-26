import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.css']
})
export class ViewSessionComponent {
  @Input() subjectName: string = '';
  @Input() day: string = '';
  @Input() startTime: string = '';
  @Input() endTime: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() moreInfo = new EventEmitter<void>();
  @Output() showSessionInfo = new EventEmitter<void>();



  onShowSubjectInfo(): void {
    this.showSessionInfo.emit();
  }

  onClose() {
    this.close.emit();
  }

  onMoreInfo() {
    this.moreInfo.emit();
  }
}
