import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../bookings.tokens';
import type { IBookingRepository } from '../interfaces/ibooking.repository';
import type { CreateBookingDto } from '../dto/create-booking.dto';
import type { CancelBookingDto } from '../dto/cancel-booking.dto';
import type { Booking } from '@prisma/client';
import type { IBookingsService } from '../interfaces/ibookings.service';

const HOURS_12 = 12 * 60 * 60 * 1000;
const HOURS_6 = 6 * 60 * 60 * 1000;

@Injectable()
export class BookingsService implements IBookingsService {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const booking = await this.bookingRepository.create({
      requestId: dto.requestId,
      workerId: dto.workerId,
      price: dto.price,
      scheduledAt: new Date(dto.scheduledAt),
    });

    // Address revealed only after payment confirmation (set via confirmPayment)
    return booking;
  }

  async confirmPayment(bookingId: string, address: string): Promise<Booking> {
    const booking = await this.requireBooking(bookingId);
    if (booking.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('Booking is not awaiting payment');
    }
    await this.bookingRepository.setExactAddress(bookingId, address);
    return this.bookingRepository.updateStatus(bookingId, 'CONFIRMED');
  }

  async startService(bookingId: string, workerId: string): Promise<Booking> {
    const booking = await this.requireBooking(bookingId);
    this.assertWorkerOwns(booking, workerId);
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Booking must be CONFIRMED to start');
    }
    return this.bookingRepository.updateStatus(bookingId, 'IN_PROGRESS');
  }

  async completeService(bookingId: string, workerId: string): Promise<Booking> {
    const booking = await this.requireBooking(bookingId);
    this.assertWorkerOwns(booking, workerId);
    if (booking.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Booking must be IN_PROGRESS to complete');
    }
    return this.bookingRepository.updateStatus(bookingId, 'COMPLETED');
  }

  async cancelByClient(
    bookingId: string,
    clientUserId: string,
    dto: CancelBookingDto,
  ): Promise<Booking> {
    const booking = await this.requireBooking(bookingId);
    if (!['PENDING_PAYMENT', 'CONFIRMED'].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel at this stage');
    }

    const msTillService = new Date(booking.scheduledAt).getTime() - Date.now();
    const penalty = msTillService < HOURS_12 ? 0.2 : 0;

    return this.bookingRepository.updateStatus(bookingId, 'CANCELLED', {
      cancelledBy: clientUserId,
      cancellationNote: `penalty:${penalty}|reason:${dto.reason ?? ''}`,
    });
  }

  async cancelByWorker(
    bookingId: string,
    workerId: string,
    dto: CancelBookingDto,
  ): Promise<Booking> {
    const booking = await this.requireBooking(bookingId);
    this.assertWorkerOwns(booking, workerId);
    if (!['CONFIRMED'].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel at this stage');
    }

    const msTillService = new Date(booking.scheduledAt).getTime() - Date.now();
    const penalty = msTillService < HOURS_6 ? 0.15 : 0;

    return this.bookingRepository.updateStatus(bookingId, 'CANCELLED', {
      cancelledBy: workerId,
      cancellationNote: `workerPenalty:${penalty}|reason:${dto.reason ?? ''}`,
    });
  }

  async getById(id: string): Promise<Booking> {
    return this.requireBooking(id);
  }

  async autoComplete(cutoff: Date): Promise<void> {
    const stale = await this.bookingRepository.findExpiredInProgress(cutoff);
    await Promise.all(
      stale.map((b) => this.bookingRepository.updateStatus(b.id, 'COMPLETED')),
    );
  }

  private async requireBooking(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  private assertWorkerOwns(booking: Booking, workerId: string): void {
    if (booking.workerId !== workerId) throw new ForbiddenException();
  }
}
