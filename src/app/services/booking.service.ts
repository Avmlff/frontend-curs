import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings: Booking[] = [];

  addBooking(booking: Booking) {
    this.bookings.push(booking);
  }

  getBookings(): Booking[] {
    return this.bookings;
  }

  checkAvailability(
    resourceId: number,
    start: Date,
    end: Date
  ): Observable<boolean> {
    return of(this.bookings).pipe(
      delay(300),
      map(bookings =>
        !bookings.some(b =>
          b.resourceId === resourceId &&
          start < b.end &&
          end > b.start
        )
      )
    );
  }
}
