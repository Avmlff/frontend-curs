import { describe, beforeEach, it, expect } from 'vitest';
import { BookingService } from './booking.service';
import { Booking } from '../models/booking.model';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    service = new BookingService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add booking', () => {
    const initialCount = service.getBookings().length;

    const newBooking: Omit<Booking, 'id'> = {
      resourceId: 1,
      start: new Date('2024-01-01T10:00:00'),
      end: new Date('2024-01-01T11:00:00'),
      title: 'Тестовая встреча'
    };

    service.addBooking(newBooking);
    const bookings = service.getBookings();

    expect(bookings.length).toBe(initialCount + 1);
    expect(bookings[bookings.length - 1].title).toBe('Тестовая встреча');
  });

  it('should detect time conflicts', async () => {
    service.addBooking({
      resourceId: 1,
      start: new Date('2024-01-01T10:00:00'),
      end: new Date('2024-01-01T12:00:00'),
      title: 'Первая встреча'
    });

    const isAvailable = await new Promise<boolean>(resolve => {
      service.checkAvailability(
        1,
        new Date('2024-01-01T11:00:00'),
        new Date('2024-01-01T13:00:00')
      ).subscribe(resolve);
    });

    expect(isAvailable).toBe(false);
  });

  it('should allow non-conflicting bookings', async () => {
    service.addBooking({
      resourceId: 1,
      start: new Date('2024-01-01T10:00:00'),
      end: new Date('2024-01-01T12:00:00'),
      title: 'Первая встреча'
    });

    const isAvailable = await new Promise<boolean>(resolve => {
      service.checkAvailability(
        1,
        new Date('2024-01-01T14:00:00'),
        new Date('2024-01-01T15:00:00')
      ).subscribe(resolve);
    });

    expect(isAvailable).toBe(true);
  });

  it('should allow bookings for different resources', async () => {
    service.addBooking({
      resourceId: 1,
      start: new Date('2024-01-01T10:00:00'),
      end: new Date('2024-01-01T12:00:00'),
      title: 'Встреча в комнате 1'
    });

    const isAvailable = await new Promise<boolean>(resolve => {
      service.checkAvailability(
        2,
        new Date('2024-01-01T11:00:00'),
        new Date('2024-01-01T13:00:00')
      ).subscribe(resolve);
    });

    expect(isAvailable).toBe(true);
  });
});
