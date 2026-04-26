import type { Booking, BookingStatus } from '@prisma/client';

export interface CreateBookingData {
  requestId: string;
  workerId: string;
  price: number;
  scheduledAt: Date;
  estimatedEndAt?: Date;
}

export interface IBookingRepository {
  create(data: CreateBookingData): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByWorker(workerId: string): Promise<Booking[]>;
  findByClient(clientId: string): Promise<Booking[]>;
  updateStatus(id: string, status: BookingStatus, extra?: Partial<Booking>): Promise<Booking>;
  setExactAddress(id: string, address: string): Promise<Booking>;
  findExpiredInProgress(cutoff: Date): Promise<Booking[]>;
}
