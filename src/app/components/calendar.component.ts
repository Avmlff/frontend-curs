import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { BookingService } from '../services/booking.service';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule],
  template: `
    <div style="padding: 20px;">
      <h2>📅 Недельный календарь</h2>

      <mat-tab-group>
        <mat-tab *ngFor="let resource of resources" [label]="resource.name">
          <div style="padding: 16px;">
            <h3>{{ resource.name }}</h3>

            <div *ngFor="let booking of getBookingsForResource(resource.id)" style="margin-bottom: 8px;">
              <mat-card>
                <mat-card-content>
                  <strong>{{ booking.title }}</strong><br>
                  🕐 {{ booking.start | date:'dd.MM HH:mm' }} - {{ booking.end | date:'HH:mm' }}
                </mat-card-content>
              </mat-card>
            </div>

            <div *ngIf="getBookingsForResource(resource.id).length === 0" style="color: #999; text-align: center; padding: 20px;">
              Нет бронирований
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
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

  getBookingsForResource(resourceId: number) {
    return this.bookings.filter(b => b.resourceId === resourceId)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }
}
