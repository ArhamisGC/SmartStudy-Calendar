import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginregisterComponent } from './components/loginregister/loginregister.component';
import { ProfileComponent} from "./components/profile/profile.component";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {HomeComponent} from "./components/website/home/home.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import { NotesComponent } from './components/notes/notes.component';
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';
import { ReminderComponent } from "./components/reminder/reminder.component";
import { TodoComponent } from "./components/todo/todo.component";
import {TimetableComponent} from "./components/timetable-component/timetable/timetable.component";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'login', component: LoginregisterComponent},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent,canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]},
  {path: 'logout', component: LogoutComponent},
  {path: 'notes', component: NotesComponent,canActivate: [AuthGuard]},
  {path: 'pomodoro', component: PomodoroComponent,canActivate: [AuthGuard]},
  {path: 'reminders', component: ReminderComponent,canActivate: [AuthGuard]},
  {path: 'todo', component: TodoComponent,canActivate: [AuthGuard]},
  {path: 'timetable', component: TimetableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
