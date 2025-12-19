import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BookingFormComponent } from './components/booking-form.component';
import { CalendarComponent } from './components/calendar.component';
import { ResourceManagementComponent } from './components/resource-management.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatToolbarModule,
    BookingFormComponent,
    CalendarComponent,
    ResourceManagementComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Планировщик встреч</span>
    </mat-toolbar>

    <div style="padding: 20px;">
      <mat-tab-group>
        <mat-tab label="Бронирование">
          <app-booking-form></app-booking-form>
        </mat-tab>
        <mat-tab label="Календарь">
          <app-calendar></app-calendar>
        </mat-tab>
        <mat-tab label="Ресурсы">
          <app-resource-management></app-resource-management>
        </mat-tab>
      </mat-tab-group>
    </div>
  `
})
export class App {}
