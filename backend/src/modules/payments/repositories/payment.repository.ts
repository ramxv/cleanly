import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { IPaymentRepository, CreatePaymentData } from '../interfaces/ipayment.repository';
import type { Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePaymentData): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  findByBooking(bookingId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { bookingId } });
  }

  findByIdempotencyKey(key: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { idempotencyKey: key } });
  }

  updateStatus(id: string, status: PaymentStatus, gatewayRef?: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: { status, ...(gatewayRef && { gatewayRef }) },
    });
  }

  findByWorker(workerId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { booking: { workerId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
