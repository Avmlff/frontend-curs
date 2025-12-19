import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { BookingService } from '../services/booking.service';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="booking-container">
      <mat-card class="booking-card">
        <mat-card-header>
          <div class="card-header-icon" mat-card-avatar>
            <mat-icon>event_note</mat-icon>
          </div>
          <mat-card-title>Забронировать ресурс</mat-card-title>
          <mat-card-subtitle>Выберите ресурс, дату и время для вашей встречи</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="booking-form">

            <div class="form-section step-section">
              <div class="step-header">
                <div class="step-number">1</div>
                <div class="step-title">
                  <mat-icon class="step-icon">meeting_room</mat-icon>
                  <h3>Выбор ресурса</h3>
                </div>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Доступные ресурсы *</mat-label>
                <mat-select formControlName="resourceId" required>
                  <mat-option *ngFor="let resource of resources" [value]="resource.id">
                    <div class="resource-option">
                      <div class="resource-icon">
                        <mat-icon>{{ resource.type === 'room' ? 'meeting_room' : 'devices' }}</mat-icon>
                      </div>
                      <div class="resource-info">
                        <div class="resource-name">{{ resource.name }}</div>
                        <div class="resource-details">
                          <span class="resource-type">{{ resource.type === 'room' ? 'Комната' : 'Оборудование' }}</span>
                          <span *ngIf="resource.capacity" class="resource-capacity"> · {{ resource.capacity }} мест</span>
                        </div>
                      </div>
                    </div>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="bookingForm.get('resourceId')?.hasError('required')">
                  Пожалуйста, выберите ресурс
                </mat-error>
              </mat-form-field>
            </div>

            <mat-divider class="step-divider"></mat-divider>

            <div class="form-section step-section">
              <div class="step-header">
                <div class="step-number">2</div>
                <div class="step-title">
                  <mat-icon class="step-icon">schedule</mat-icon>
                  <h3>Время встречи</h3>
                </div>
              </div>

              <div class="time-fields">
                <mat-form-field appearance="outline" class="time-field">
                  <mat-label>Начало встречи *</mat-label>
                  <input matInput type="datetime-local" formControlName="start" required>
                  <mat-icon matPrefix class="time-icon">access_time</mat-icon>
                  <mat-hint>дд.мм.гггг чч:мм</mat-hint>
                  <mat-error *ngIf="bookingForm.get('start')?.hasError('required')">
                    Укажите время начала
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="time-field">
                  <mat-label>Окончание встречи *</mat-label>
                  <input matInput type="datetime-local" formControlName="end" required>
                  <mat-icon matPrefix class="time-icon">access_time</mat-icon>
                  <mat-hint>дд.мм.гггг чч:мм</mat-hint>
                  <mat-error *ngIf="bookingForm.get('end')?.hasError('required')">
                    Укажите время окончания
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <mat-divider class="step-divider"></mat-divider>

            <div class="form-section step-section">
              <div class="step-header">
                <div class="step-number">3</div>
                <div class="step-title">
                  <mat-icon class="step-icon">description</mat-icon>
                  <h3>Описание встречи</h3>
                </div>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Название встречи *</mat-label>
                <textarea matInput formControlName="title" rows="3"
                          placeholder="Например: Ежедневная планерка, Совещание по проекту XYZ..."></textarea>
                <mat-icon matPrefix>title</mat-icon>
                <mat-hint>Введите описание вашей встречи</mat-hint>
                <mat-error *ngIf="bookingForm.get('title')?.hasError('required')">
                  Введите название встречи
                </mat-error>
                <mat-error *ngIf="bookingForm.get('title')?.hasError('minlength')">
                  Минимум 3 символа
                </mat-error>
              </mat-form-field>
            </div>

            <div *ngIf="showValidationMessages" class="validation-section">
              <mat-card class="validation-card" *ngIf="bookingForm.hasError('resourceBusy')">
                <mat-card-content class="validation-error">
                  <mat-icon>error_outline</mat-icon>
                  <span>Ресурс занят в выбранное время. Пожалуйста, выберите другое время.</span>
                </mat-card-content>
              </mat-card>

              <mat-card class="validation-card" *ngIf="bookingForm.hasError('timeInvalid')">
                <mat-card-content class="validation-error">
                  <mat-icon>error_outline</mat-icon>
                  <span>Время окончания должно быть позже времени начала.</span>
                </mat-card-content>
              </mat-card>

              <mat-card class="validation-card" *ngIf="bookingForm.valid && !bookingForm.pending">
                <mat-card-content class="validation-success">
                  <mat-icon>check_circle</mat-icon>
                  <span>Время доступно! Можно бронировать.</span>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="form-actions">
              <button mat-raised-button
                      color="primary"
                      type="submit"
                      [disabled]="bookingForm.invalid || bookingForm.pending"
                      class="submit-button">
                <mat-icon *ngIf="!bookingForm.pending">book_online</mat-icon>
                <mat-spinner *ngIf="bookingForm.pending" diameter="20"></mat-spinner>
                {{ bookingForm.pending ? 'Проверка доступности...' : 'Забронировать' }}
              </button>

              <button mat-stroked-button
                      type="button"
                      (click)="resetForm()"
                      color="warn"
                      class="reset-button">
                <mat-icon>refresh</mat-icon>
                Очистить форму
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .booking-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .booking-card {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      margin-bottom: 24px;
      border: 1px solid #e0e0e0;
    }

    .card-header-icon {
      background: linear-gradient(135deg, #3f51b5 0%, #2196f3 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-header-icon mat-icon {
      color: white;
    }

    .booking-form {
      padding: 8px 0;
    }

    .step-section {
      margin-bottom: 32px;
      padding: 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 2px solid #e3f2fd;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
      transition: all 0.3s ease;
    }

    .step-section:hover {
      border-color: #2196f3;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f5f5f5;
    }

    .step-number {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #3f51b5 0%, #2196f3 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
    }

    .step-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .step-title h3 {
      margin: 0;
      color: #333;
      font-weight: 600;
      font-size: 18px;
    }

    .step-icon {
      color: #2196f3;
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .step-divider {
      margin: 32px 0;
      border-color: #e0e0e0;
    }

    .full-width {
      width: 100%;
    }

    .time-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .time-field {
      width: 100%;
    }

    .time-icon {
      color: #2196f3;
    }

    .resource-option {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
    }

    .resource-icon {
      background: #e3f2fd;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .resource-icon mat-icon {
      color: #2196f3;
    }

    .resource-info {
      flex: 1;
    }

    .resource-name {
      font-weight: 500;
      font-size: 16px;
      color: #333;
      margin-bottom: 4px;
    }

    .resource-details {
      display: flex;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .resource-type {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .resource-capacity {
      color: #666;
      font-style: italic;
    }

    .validation-section {
      margin: 24px 0;
    }

    .validation-card {
      margin-bottom: 12px;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .validation-card:last-child {
      margin-bottom: 0;
    }

    .validation-error {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #d32f2f;
      padding: 12px;
    }

    .validation-success {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #2e7d32;
      padding: 12px;
    }

    .validation-card[ng-reflect-class-name*="error"] {
      border-left-color: #d32f2f;
      background: #ffebee;
    }

    .validation-card[ng-reflect-class-name*="success"] {
      border-left-color: #2e7d32;
      background: #e8f5e9;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 2px solid #f0f0f0;
    }

    .submit-button {
      padding: 12px 32px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 200px;
      height: 48px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3f51b5 0%, #2196f3 100%);
    }

    .reset-button {
      padding: 12px 24px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .time-fields {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-actions {
        flex-direction: column;
      }

      .submit-button, .reset-button {
        width: 100%;
        justify-content: center;
      }

      .step-section {
        padding: 16px;
      }

      .step-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .step-title {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  resources: any[] = [];
  showValidationMessages = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private resourceService: ResourceService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      resourceId: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]]
    }, {
      asyncValidators: [this.availabilityValidator.bind(this)],
      validators: this.timeValidator
    });

    this.bookingForm.valueChanges.subscribe(() => {
      this.showValidationMessages = true;
    });
  }

  ngOnInit() {
    this.resources = this.resourceService.getResources();
  }

  availabilityValidator(control: AbstractControl): Observable<{ [key: string]: any } | null> {
    const resourceId = control.get('resourceId')?.value;
    const start = control.get('start')?.value;
    const end = control.get('end')?.value;

    if (!resourceId || !start || !end) {
      return of(null);
    }

    return of(null).pipe(
      debounceTime(500),
      switchMap(() =>
        this.bookingService.checkAvailability(
          resourceId,
          new Date(start),
          new Date(end)
        ).pipe(
          map(available => available ? null : { resourceBusy: true })
        )
      )
    );
  }

  timeValidator(group: AbstractControl): { [key: string]: any } | null {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;

    if (start && end && new Date(end) <= new Date(start)) {
      return { timeInvalid: true };
    }
    return null;
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const value = this.bookingForm.value;

      this.bookingService.addBooking({
        resourceId: value.resourceId,
        start: new Date(value.start),
        end: new Date(value.end),
        title: value.title
      });

      this.snackBar.open('🎉 Бронирование успешно создано!', 'Закрыть', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      this.resetForm();
    }
  }

  resetForm() {
    this.bookingForm.reset();
    this.showValidationMessages = false;
    Object.keys(this.bookingForm.controls).forEach(key => {
      this.bookingForm.get(key)?.setErrors(null);
    });
  }
}
