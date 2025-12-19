import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BookingService } from '../services/booking.service';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div style="padding: 20px;">
      <h2>Новое бронирование</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
          <mat-label>Ресурс</mat-label>
          <mat-select formControlName="resourceId">
            <mat-option *ngFor="let r of resources" [value]="r.id">{{ r.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
          <mat-label>Начало</mat-label>
          <input matInput type="datetime-local" formControlName="start">
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
          <mat-label>Окончание</mat-label>
          <input matInput type="datetime-local" formControlName="end">
        </mat-form-field>

        <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
          <mat-label>Описание</mat-label>
          <input matInput formControlName="title">
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Забронировать
        </button>
      </form>
    </div>
  `
})
export class BookingFormComponent implements OnInit {
  form: FormGroup;
  resources: any[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private resourceService: ResourceService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      resourceId: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      title: ['']
    }, {
      asyncValidators: this.availabilityValidator.bind(this),
      validators: this.timeValidator
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
    if (this.form.valid) {
      const value = this.form.value;
      this.bookingService.addBooking({
        resourceId: value.resourceId,
        start: new Date(value.start),
        end: new Date(value.end),
        title: value.title || 'Без названия'
      });

      this.snackBar.open('Бронирование создано!', 'OK', { duration: 3000 });
      this.form.reset();
    }
  }
}
