import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings: Booking[] = [
    {
      id: 1,
      resourceId: 1,
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(11, 0, 0, 0)),
      title: 'Планерка'
    },
    {
      id: 2,
      resourceId: 2,
      start: new Date(new Date().setHours(14, 0, 0, 0)),
      end: new Date(new Date().setHours(15, 30, 0, 0)),
      title: 'Совещание'
    }
  ];

  addBooking(booking: Omit<Booking, 'id'>) {
    const newBooking: Booking = {
      ...booking,
      id: Date.now()
    };
    this.bookings.push(newBooking);
  }

  getBookings(): Booking[] {
    return this.bookings;
  }

  checkAvailability(resourceId: number, start: Date, end: Date): Observable<boolean> {
    const hasConflict = this.bookings.some(b =>
      b.resourceId === resourceId &&
      start < b.end &&
      end > b.start
    );
    return of(!hasConflict).pipe(delay(500));
  }

  removeBooking(id: number) {
    this.bookings = this.bookings.filter(b => b.id !== id);
  }
}
