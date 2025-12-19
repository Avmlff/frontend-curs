import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { BookingService } from '../services/booking.service';
import { ResourceService } from '../services/resource.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule
  ],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <h2>
          <mat-icon class="header-icon">calendar_month</mat-icon>
          Недельный календарь бронирований
        </h2>

        <div class="date-navigation">
          <button mat-icon-button (click)="previousWeek()">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span class="current-week">{{ getWeekRange() }}</span>
          <button mat-icon-button (click)="nextWeek()">
            <mat-icon>chevron_right</mat-icon>
          </button>
          <button mat-stroked-button (click)="currentWeek()" class="today-btn">
            <mat-icon>today</mat-icon>
            Сегодня
          </button>
        </div>
      </div>

      <div class="calendar-grid">
        <div class="calendar-day-header" *ngFor="let day of weekDays">
          <div class="day-name">{{ day.name }}</div>
          <div class="day-date">{{ day.date | date:'dd.MM' }}</div>
        </div>

        <div *ngFor="let timeSlot of timeSlots" class="time-slot">
          <div class="time-label">{{ timeSlot }}</div>

          <div *ngFor="let day of weekDays; let i = index"
               class="calendar-cell"
               [class.has-booking]="hasBooking(day.date, timeSlot)"
               (click)="showBookingDetails(day.date, timeSlot)">

            <div *ngFor="let booking of getBookingsForDayAndTime(day.date, timeSlot)"
                 class="booking-event"
                 [style.background]="getResourceColor(booking.resourceId)">
              <mat-icon class="event-icon">event</mat-icon>
              <div class="event-details">
                <div class="event-title">{{ booking.title }}</div>
                <div class="event-time">{{ booking.start | date:'HH:mm' }} - {{ booking.end | date:'HH:mm' }}</div>
                <div class="event-resource">{{ getResourceName(booking.resourceId) }}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="resources-legend">
        <h3>Ресурсы</h3>
        <div class="legend-items">
          <div *ngFor="let resource of resources" class="legend-item">
            <div class="color-box" [style.background]="getResourceColor(resource.id)"></div>
            <span>{{ resource.name }}</span>
            <mat-chip class="booking-count">{{ getBookingCountForResource(resource.id) }}</mat-chip>
          </div>
        </div>
      </div>

      <div class="calendar-stats">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-item">
              <mat-icon color="primary">event_busy</mat-icon>
              <div class="stat-text">
                <div class="stat-number">{{ getBusySlots() }}</div>
                <div class="stat-label">Занято слотов на неделе</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-item">
              <mat-icon color="accent">meeting_room</mat-icon>
              <div class="stat-text">
                <div class="stat-number">{{ getMostBookedResource()?.count || 0 }}</div>
                <div class="stat-label">
                  {{ getMostBookedResource()?.name ? 'Чаще всего бронируют: ' + getMostBookedResource()?.name : 'Нет бронирований' }}
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 16px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .calendar-header h2 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #3f51b5;
    }

    .header-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
    }

    .date-navigation {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .current-week {
      font-size: 18px;
      font-weight: 500;
      min-width: 220px;
      text-align: center;
    }

    .today-btn {
      margin-left: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: 80px repeat(7, 1fr);
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }

    .calendar-day-header {
      padding: 16px 8px;
      text-align: center;
      background: #3f51b5;
      color: white;
      border-right: 1px solid rgba(255,255,255,0.1);
    }

    .calendar-day-header:last-child {
      border-right: none;
    }

    .day-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .day-date {
      font-size: 20px;
      font-weight: 700;
    }

    .time-slot {
      display: contents;
    }

    .time-label {
      padding: 12px;
      background: #f5f5f5;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-weight: 500;
      color: #666;
    }

    .calendar-cell {
      padding: 8px;
      border-right: 1px solid #e0e0e0;
      border-top: 1px solid #e0e0e0;
      min-height: 80px;
      background: #fafafa;
      position: relative;
      cursor: pointer;
      transition: background 0.2s;
    }

    .calendar-cell:hover {
      background: #f0f0f0;
    }

    .calendar-cell.has-booking {
      background: rgba(63, 81, 181, 0.05);
    }

    .calendar-cell:last-child {
      border-right: none;
    }

    .booking-event {
      position: absolute;
      left: 4px;
      right: 4px;
      padding: 8px;
      border-radius: 6px;
      color: white;
      display: flex;
      gap: 8px;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 1;
      overflow: hidden;
    }

    .event-icon {
      flex-shrink: 0;
      font-size: 18px;
    }

    .event-details {
      flex: 1;
      min-width: 0;
    }

    .event-title {
      font-weight: 500;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .event-time {
      font-size: 11px;
      opacity: 0.9;
    }

    .event-resource {
      font-size: 11px;
      opacity: 0.8;
      font-style: italic;
    }

    .resources-legend {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .resources-legend h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #f8f9fa;
      border-radius: 20px;
    }

    .color-box {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    .booking-count {
      margin-left: 8px;
      font-size: 12px;
      height: 20px;
    }

    .calendar-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .stat-card {
      border-radius: 8px;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;
    }

    .stat-item mat-icon {
      font-size: 40px;
      height: 40px;
      width: 40px;
    }

    .stat-text {
      flex: 1;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 2px;
    }

    @media (max-width: 768px) {
      .calendar-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .calendar-grid {
        grid-template-columns: 60px repeat(7, 1fr);
        font-size: 12px;
      }

      .day-date {
        font-size: 16px;
      }

      .booking-event {
        padding: 4px;
      }

      .event-title {
        font-size: 11px;
      }

      .event-time, .event-resource {
        font-size: 9px;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  bookings: any[] = [];
  resources: any[] = [];
  currentDate = new Date();

  timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  weekDays: { date: Date; name: string }[] = [];

  constructor(
    private bookingService: BookingService,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.bookings = this.bookingService.getBookings();
    this.resources = this.resourceService.getResources();
    this.generateWeekDays();
  }

  generateWeekDays() {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Начинаем с понедельника

    this.weekDays = [];
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      this.weekDays.push({
        date: date,
        name: daysOfWeek[i]
      });
    }
  }

  getWeekRange(): string {
    if (this.weekDays.length === 0) return '';
    const first = this.weekDays[0].date;
    const last = this.weekDays[6].date;
    return `${first.getDate()}.${first.getMonth() + 1} - ${last.getDate()}.${last.getMonth() + 1}.${last.getFullYear()}`;
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeekDays();
  }

  currentWeek() {
    this.currentDate = new Date();
    this.generateWeekDays();
  }

  hasBooking(day: Date, timeSlot: string): boolean {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStart = new Date(day);
    slotStart.setHours(hours, minutes, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(hours + 1, minutes, 0, 0);

    return this.bookings.some(booking => {
      const bookingStart = new Date(booking.start);
      const bookingEnd = new Date(booking.end);
      return bookingStart < slotEnd && bookingEnd > slotStart &&
        bookingStart.getDate() === day.getDate() &&
        bookingStart.getMonth() === day.getMonth() &&
        bookingStart.getFullYear() === day.getFullYear();
    });
  }

  getBookingsForDayAndTime(day: Date, timeSlot: string): any[] {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStart = new Date(day);
    slotStart.setHours(hours, minutes, 0, 0);

    return this.bookings.filter(booking => {
      const bookingStart = new Date(booking.start);
      return bookingStart.getDate() === day.getDate() &&
        bookingStart.getMonth() === day.getMonth() &&
        bookingStart.getFullYear() === day.getFullYear() &&
        bookingStart.getHours() === hours;
    });
  }

  getResourceColor(resourceId: number): string {
    const colors = [
      '#3f51b5', '#2196f3', '#009688', '#4caf50',
      '#ff9800', '#f44336', '#9c27b0', '#673ab7'
    ];
    return colors[resourceId % colors.length];
  }

  getResourceName(resourceId: number): string {
    const resource = this.resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Неизвестно';
  }

  getBookingCountForResource(resourceId: number): number {
    return this.bookings.filter(b => b.resourceId === resourceId).length;
  }

  getBusySlots(): number {
    let count = 0;
    this.weekDays.forEach(day => {
      this.timeSlots.forEach(timeSlot => {
        if (this.hasBooking(day.date, timeSlot)) {
          count++;
        }
      });
    });
    return count;
  }

  getMostBookedResource(): { name: string; count: number } | null {
    if (this.bookings.length === 0) return null;

    const counts = new Map<number, number>();
    this.bookings.forEach(booking => {
      counts.set(booking.resourceId, (counts.get(booking.resourceId) || 0) + 1);
    });

    let maxResourceId = -1;
    let maxCount = 0;

    counts.forEach((count, resourceId) => {
      if (count > maxCount) {
        maxCount = count;
        maxResourceId = resourceId;
      }
    });

    if (maxResourceId === -1) return null;

    const resource = this.resources.find(r => r.id === maxResourceId);
    return {
      name: resource ? resource.name : 'Неизвестно',
      count: maxCount
    };
  }

  showBookingDetails(day: Date, timeSlot: string): void {
    const bookings = this.getBookingsForDayAndTime(day, timeSlot);
    if (bookings.length > 0) {
      console.log('Бронирования:', bookings);
    }
  }
}
