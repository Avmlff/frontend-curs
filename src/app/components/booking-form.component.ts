import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
    MatProgressSpinnerModule
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

            <div class="form-section">
              <div class="section-header">
                <mat-icon class="section-icon">meeting_room</mat-icon>
                <h3>Шаг 1: Выбор ресурса</h3>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Доступные ресурсы</mat-label>
                <mat-select formControlName="resourceId" required>
                  <mat-option *ngFor="let resource of resources" [value]="resource.id">
                    <div class="resource-option">
                      <mat-icon>{{ resource.type === 'room' ? 'meeting_room' : 'devices' }}</mat-icon>
                      <span>{{ resource.name }}</span>
                      <span class="resource-type">{{ resource.type === 'room' ? 'Комната' : 'Оборудование' }}</span>
                    </div>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="bookingForm.get('resourceId')?.hasError('required')">
                  Пожалуйста, выберите ресурс
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-section">
              <div class="section-header">
                <mat-icon class="section-icon">schedule</mat-icon>
                <h3>Шаг 2: Время встречи</h3>
              </div>
              <div class="time-fields">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Начало встречи</mat-label>
                  <input matInput type="datetime-local" formControlName="start" required>
                  <mat-icon matPrefix>access_time</mat-icon>
                  <mat-error *ngIf="bookingForm.get('start')?.hasError('required')">
                    Укажите время начала
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Окончание встречи</mat-label>
                  <input matInput type="datetime-local" formControlName="end" required>
                  <mat-icon matPrefix>access_time</mat-icon>
                  <mat-error *ngIf="bookingForm.get('end')?.hasError('required')">
                    Укажите время окончания
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="form-section">
              <div class="section-header">
                <mat-icon class="section-icon">description</mat-icon>
                <h3>Шаг 3: Описание встречи</h3>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Название встречи</mat-label>
                <textarea matInput formControlName="title" rows="3"
                         placeholder="Например: Ежедневная планерка, Совещание по проекту XYZ..."></textarea>
                <mat-icon matPrefix>title</mat-icon>
              </mat-form-field>
            </div>

            <div *ngIf="showValidationMessages" class="validation-messages">
              <div *ngIf="bookingForm.hasError('resourceBusy')" class="validation-error">
                <mat-icon>error_outline</mat-icon>
                <span>Ресурс занят в выбранное время. Пожалуйста, выберите другое время.</span>
              </div>

              <div *ngIf="bookingForm.hasError('timeInvalid')" class="validation-error">
                <mat-icon>error_outline</mat-icon>
                <span>Время окончания должно быть позже времени начала.</span>
              </div>

              <div *ngIf="bookingForm.valid && !bookingForm.pending" class="validation-success">
                <mat-icon>check_circle</mat-icon>
                <span>Время доступно! Можно бронировать.</span>
              </div>
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
                      color="warn">
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
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      margin-bottom: 24px;
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

    .form-section {
      margin-bottom: 32px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 4px solid #3f51b5;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .section-icon {
      color: #3f51b5;
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .section-header h3 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .time-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: 100%;
    }

    .resource-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .resource-type {
      margin-left: auto;
      background: #e3f2fd;
      color: #1976d2;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .validation-messages {
      margin: 24px 0;
      padding: 16px;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .validation-error {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #d32f2f;
      padding: 8px 0;
    }

    .validation-success {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #2e7d32;
      padding: 8px 0;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    .submit-button {
      padding: 8px 32px;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 180px;
    }

    @media (max-width: 768px) {
      .time-fields {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .submit-button {
        width: 100%;
        justify-content: center;
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
      asyncValidators: this.availabilityValidator.bind(this),
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

    return this.bookingService.checkAvailability(
      resourceId,
      new Date(start),
      new Date(end)
    ).pipe(
      map(available => available ? null : { resourceBusy: true })
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
