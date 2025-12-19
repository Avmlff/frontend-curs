import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule, MatCardModule],
  template: `
    <h3>Календарь бронирований</h3>
    <div *ngFor="let b of bookings">
      <mat-card style="margin-bottom:8px; padding:8px;">
        <strong>Ресурс {{ b.resourceId }}</strong>:
        {{ b.start | date:'dd.MM.yyyy, HH:mm' }} – {{ b.end | date:'dd.MM.yyyy, HH:mm' }}
      </mat-card>
    </div>
  `
})
export class CalendarComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookings = this.bookingService.getBookings();
  }
}
