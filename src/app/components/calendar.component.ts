// app/components/calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BookingService } from '../services/booking.service';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div style="padding: 20px;">
      <h2>Календарь бронирований</h2>

      <div *ngFor="let booking of bookings" style="margin-bottom: 10px;">
        <mat-card>
          <mat-card-content>
            <strong>Ресурс {{ getResourceName(booking.resourceId) }}</strong><br>
            {{ booking.start | date:'dd.MM.yyyy HH:mm' }} - {{ booking.end | date:'HH:mm' }}<br>
            {{ booking.title }}
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class CalendarComponent implements OnInit {
  bookings: any[] = [];
  resources: any[] = [];

  constructor(
    private bookingService: BookingService,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.bookings = this.bookingService.getBookings();
    this.resources = this.resourceService.getResources();
  }

  getResourceName(resourceId: number): string {
    const resource = this.resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Неизвестно';
  }
}
