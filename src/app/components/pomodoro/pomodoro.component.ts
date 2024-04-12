import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css'],
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

export class PomodoroComponent {
  timer: string = '50:00'; // Initialize timer
  minutes: number = 50;
  seconds: number = 0;
  isPaused: boolean = true;
  enteredTime: number | null = null;
  interval: any;

  constructor() {}

  startTimer() {
    this.interval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    if (!this.isPaused) {
      this.timer = this.formatTime(this.minutes, this.seconds);
      if (this.minutes === 0 && this.seconds === 0) {
        clearInterval(this.interval);
        alert('Time is up! Take a break.');
      } else {
        if (this.seconds > 0) {
          this.seconds--;
        } else {
          this.seconds = 59;
          this.minutes--;
        }
      }
    }
  }

  formatTime(minutes: number, seconds: number): string {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  togglePauseResume() {
    this.isPaused = !this.isPaused;

    if (!this.isPaused) {
      this.startTimer();
    } else {
      clearInterval(this.interval);
    }
  }

  restartTimer() {
    clearInterval(this.interval);
    this.minutes = this.enteredTime || 15;
    this.seconds = 0;
    this.isPaused = true;
    this.timer = this.formatTime(this.minutes, this.seconds);
  }

  chooseTime() {
    const newTime = prompt('Enter new time in minutes:');
    if (newTime !== null && !isNaN(Number(newTime)) && Number(newTime) > 0) {
      this.enteredTime = parseInt(newTime);
      this.minutes = this.enteredTime;
      this.seconds = 0;
      this.isPaused = true;
      this.timer = this.formatTime(this.minutes, this.seconds);
    } else {
      alert('Invalid input. Please enter a valid number greater than 0.');
    }
  }

  addPomodoroTime() {
    this.minutes += 5;
    // this.enteredTime = this.minutes + 5;
    this.timer = this.formatTime(this.minutes, this.seconds);
  }

  subPomodoroTime() {
    if (this.minutes > 5) {
      this.minutes -= 5;
      // this.enteredTime = this.minutes - 5;
      this.timer = this.formatTime(this.minutes, this.seconds);
    }
  }


}
