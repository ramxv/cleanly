import type { Payment, PaymentStatus } from '@prisma/client';

export interface CreatePaymentData {
  bookingId: string;
  amount: number;
  commission: number;
  netAmount: number;
  idempotencyKey: string;
}

export interface IPaymentRepository {
  create(data: CreatePaymentData): Promise<Payment>;
  findByBooking(bookingId: string): Promise<Payment | null>;
  findByIdempotencyKey(key: string): Promise<Payment | null>;
  updateStatus(id: string, status: PaymentStatus, gatewayRef?: string): Promise<Payment>;
  findByWorker(workerId: string): Promise<Payment[]>;
}
