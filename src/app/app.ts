import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BookingFormComponent } from './components/booking-form.component';
import { CalendarComponent } from './components/calendar.component';
import { ResourceManagementComponent } from './components/resource-management.component';
import { BookingService } from './services/booking.service';
import { ResourceService } from './services/resource.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    BookingFormComponent,
    CalendarComponent,
    ResourceManagementComponent
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="main-header">
        <div class="header-content">
          <div class="logo-section">
            <mat-icon class="logo-icon">calendar_today</mat-icon>
            <h1 class="app-title">Планировщик встреч</h1>
          </div>
          <div class="header-subtitle">
            Умное и легкое планирование встреч и ресурсов
          </div>
        </div>
      </mat-toolbar>

      <main class="main-content">
        <mat-card class="content-card">
          <mat-tab-group animationDuration="300ms" color="accent">
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="tab-icon">event_available</mat-icon>
                Новое бронирование
              </ng-template>
              <div class="tab-content">
                <app-booking-form></app-booking-form>
              </div>
            </mat-tab>

            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="tab-icon">calendar_month</mat-icon>
                Календарь
              </ng-template>
              <div class="tab-content">
                <app-calendar></app-calendar>
              </div>
            </mat-tab>

            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="tab-icon">meeting_room</mat-icon>
                Ресурсы
              </ng-template>
              <div class="tab-content">
                <app-resource-management></app-resource-management>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>

        <div class="stats-section">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon color="primary">event</mat-icon>
                <div class="stat-text">
                  <div class="stat-number">{{ getStats().totalBookings }}</div>
                  <div class="stat-label">Всего бронирований</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon color="accent">meeting_room</mat-icon>
                <div class="stat-text">
                  <div class="stat-number">{{ getStats().totalResources }}</div>
                  <div class="stat-label">Доступных ресурсов</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: flex;
      flex-direction: column;
    }

    .main-header {
      padding: 0 24px;
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
    }

    .header-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 0;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 4px;
    }

    .logo-icon {
      font-size: 36px;
      height: 36px;
      width: 36px;
    }

    .app-title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .header-subtitle {
      font-size: 14px;
      opacity: 0.9;
      font-weight: 300;
    }

    .main-content {
      flex: 1;
      padding: 24px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }

    .content-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }

    .tab-icon {
      margin-right: 8px;
      vertical-align: middle;
    }

    .tab-content {
      padding: 24px;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      border-radius: 12px;
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
      .main-content {
        padding: 16px;
      }

      .tab-content {
        padding: 16px;
      }

      .logo-section {
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }

      .header-subtitle {
        text-align: center;
      }
    }
  `]
})
export class App {
  constructor(
    private bookingService: BookingService,
    private resourceService: ResourceService
  ) {}

  getStats() {
    return {
      totalBookings: this.bookingService.getBookings().length,
      totalResources: this.resourceService.getResources().length
    };
  }
}
