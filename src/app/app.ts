import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BookingFormComponent } from './components/booking-form.component';
import { CalendarComponent } from './components/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    BookingFormComponent,
    CalendarComponent
  ],
  template: `
    <mat-toolbar color="primary">
      Планирование встреч и ресурсов
    </mat-toolbar>

    <div style="padding:16px">
      <app-booking-form></app-booking-form>
      <hr>
      <app-calendar></app-calendar>
    </div>
  `
})
export class App {}
