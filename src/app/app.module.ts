import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import { EventViewerComponent } from './components/event-viewer/event-viewer.component';
import {getAuth, provideAuth} from "@angular/fire/auth";
import { EventCreatorComponent } from './components/event-creator/event-creator.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { EventEditorComponent } from './components/event-editor/event-editor.component';
import { SubjectManagerComponent } from './components/subject-manager/subject-manager.component';
import { SubjectViewerComponent } from './components/subject-viewer/subject-viewer.component';
import { SubjectEditorComponent } from './components/subject-editor/subject-editor.component';
import { ProfessorCreatorComponent } from './components/professor-creator/professor-creator.component';
import { ProfessorManagerComponent } from './components/professor-manager/professor-manager.component';
import { SubjectCreatorComponent } from './components/subject-creator/subject-creator.component';
import { EventListViewerComponent } from './components/event-list-viewer/event-list-viewer.component';
import { LoginregisterComponent } from './components/loginregister/loginregister.component';
import {AngularFireModule} from "@angular/fire/compat";
import { ProfileComponent } from './components/profile/profile.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './components/website/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotesComponent } from "./components/notes/notes.component";
import { TodoComponent } from './components/todo/todo.component';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatToolbar} from "@angular/material/toolbar";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {ToastrModule} from "ngx-toastr";
import { ReminderComponent } from "./components/reminder/reminder.component";
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';
import { TimetableComponent } from './components/timetable-component/timetable/timetable.component';
import { AddSessionComponent } from './components/timetable-component/add-session/add-session.component';
import { EditSessionComponent } from './components/timetable-component/edit-session/edit-session.component';
import { ViewSessionComponent } from './components/timetable-component/view-session/view-session.component';
import { ProfessorEditorComponent } from './components/professor-editor/professor-editor.component';
import { WeatherWidgetComponent } from './components/weather-widget/weather-widget.component';
import {NgxWeatherModule} from "ngx-weather";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import { NotificationComponent } from './components/notification/notification.component';
import { ToFindComponent } from './components/timetable-component/to-find/to-find.component';

@NgModule({
    declarations: [
        AppComponent,
        CalendarComponent,
        EventViewerComponent,
        EventCreatorComponent,
        EventEditorComponent,
        SubjectManagerComponent,
        SubjectViewerComponent,
        SubjectEditorComponent,
        ProfessorCreatorComponent,
        ProfessorManagerComponent,
        SubjectEditorComponent,
        SubjectCreatorComponent,
        LoginregisterComponent,
        ProfileComponent,
        EventListViewerComponent,
        HomeComponent,
        HeaderComponent,
        LogoutComponent,
        DashboardComponent,
        NotesComponent,
        TodoComponent,
        ReminderComponent,
        PomodoroComponent,
        TimetableComponent,
        AddSessionComponent,
        EditSessionComponent,
        ViewSessionComponent,
        ProfessorEditorComponent,
        NotificationComponent,
        WeatherWidgetComponent,
        ToFindComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AngularFireAuthModule,
        CommonModule,
        FaIconComponent,
        MatCardContent,
        MatToolbar,
        MatCard,
        MatLabel,
        MatFormField,
        ToastrModule.forRoot(),
        NgxWeatherModule.forRoot({
            apiKey: 'b042f834f54d47e282075749242904'
        }),
        MatButton,
        NgOptimizedImage,
    ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

