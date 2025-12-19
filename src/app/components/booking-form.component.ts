import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { ResourceService } from '../services/resource.service';
import { Resource } from '../models/resource.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-booking-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h3>Новая встреча / бронирование ресурса</h3>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="fill" style="width:100%; margin-bottom:8px;">
        <mat-label>Ресурс</mat-label>
        <mat-select formControlName="resourceId" required>
          <mat-option *ngFor="let r of resources" [value]="r.id">{{ r.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" style="width:100%; margin-bottom:8px;">
        <mat-label>Дата и время начала</mat-label>
        <input matInput [matDatepicker]="startPicker" formControlName="start" required>
        <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
        <mat-datepicker #startPicker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="fill" style="width:100%; margin-bottom:8px;">
        <mat-label>Дата и время окончания</mat-label>
        <input matInput [matDatepicker]="endPicker" formControlName="end" required>
        <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
        <mat-datepicker #endPicker></mat-datepicker>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
        Забронировать
      </button>
    </form>

    <div *ngIf="message" style="margin-top:8px; color:red;">
      {{ message }}
    </div>
  `
})
export class BookingFormComponent implements OnInit {
  form!: FormGroup;
  resources: Resource[] = [];
  message = '';

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private resourceService: ResourceService
  ) {}

  ngOnInit(): void {
    this.resources = this.resourceService.getResources();

    this.form = this.fb.group({
      resourceId: [null, Validators.required],
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }

  submit() {
    const { resourceId, start, end } = this.form.value;

    if (!resourceId || !start || !end) return;

    this.bookingService.checkAvailability(+resourceId, new Date(start), new Date(end))
      .subscribe(available => {
        if (available) {
          this.bookingService.addBooking({
            resourceId: +resourceId,
            start: new Date(start),
            end: new Date(end)
          });
          this.message = 'Бронирование успешно!';
          this.form.reset();
        } else {
          this.message = 'Ресурс занят в выбранное время!';
        }
      });
  }
}
