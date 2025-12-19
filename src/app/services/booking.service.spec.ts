import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    service = new BookingService();
  });

  it('should add booking', () => {
    const initialCount = service.getBookings().length;

    service.addBooking({
      resourceId: 1,
      start: new Date('2024-01-01T10:00:00'),
      end: new Date('2024-01-01T11:00:00'),
      title: 'Тест'
    });

    expect(service.getBookings().length).toBe(initialCount + 1);
  });

  it('should check availability correctly', (done) => {
    // Добавляем бронирование с 10:00 до 11:00
    service.addBooking({
      resourceId: 1,
      start: new Date('2024-01-01T10:00:00'),
      end: new Date('2024-01-01T11:00:00'),
      title: 'Существующее'
    });

    // Проверяем пересекающееся время
    service.checkAvailability(
      1,
      new Date('2024-01-01T10:30:00'),
      new Date('2024-01-01T11:30:00')
    ).subscribe(available => {
      expect(available).toBe(false); // Должно быть false (пересекается)
      done();
    });
  });
});
