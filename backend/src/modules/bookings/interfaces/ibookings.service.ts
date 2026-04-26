import type { CreateBookingDto } from '../dto/create-booking.dto';
import type { CancelBookingDto } from '../dto/cancel-booking.dto';
import type { Booking } from '@prisma/client';

export interface IBookingsService {
  create(dto: CreateBookingDto): Promise<Booking>;
  confirmPayment(bookingId: string, address: string): Promise<Booking>;
  startService(bookingId: string, workerId: string): Promise<Booking>;
  completeService(bookingId: string, workerId: string): Promise<Booking>;
  cancelByClient(bookingId: string, clientUserId: string, dto: CancelBookingDto): Promise<Booking>;
  cancelByWorker(bookingId: string, workerId: string, dto: CancelBookingDto): Promise<Booking>;
  getById(id: string): Promise<Booking>;
  autoComplete(cutoff: Date): Promise<void>;
}
