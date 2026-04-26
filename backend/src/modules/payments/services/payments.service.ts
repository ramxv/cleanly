import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_REPOSITORY } from '../payments.tokens';
import { PAYMENT_GATEWAY } from '../.././../infrastructure/payments/payments.tokens';
import type { IPaymentRepository } from '../interfaces/ipayment.repository';
import type { IPaymentGateway } from '../../../infrastructure/payments/ipayment-gateway.interface';
import type { ProcessPaymentDto } from '../dto/process-payment.dto';
import type { Payment } from '@prisma/client';
import { BookingsService } from '../../bookings/services/bookings.service';

@Injectable()
export class PaymentsService {
  private readonly commissionRate: number;

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
    private readonly bookingsService: BookingsService,
    config: ConfigService,
  ) {
    this.commissionRate = parseFloat(
      config.get<string>('PLATFORM_COMMISSION_RATE', '0.15'),
    );
  }

  async processPayment(dto: ProcessPaymentDto): Promise<Payment> {
    const existing = await this.paymentRepository.findByIdempotencyKey(
      dto.idempotencyKey,
    );
    if (existing) return existing;

    const booking = await this.bookingsService.getById(dto.bookingId);
    if (booking.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('Booking is not awaiting payment');
    }

    const amount = Number(booking.price);
    const commission = parseFloat((amount * this.commissionRate).toFixed(2));
    const netAmount = parseFloat((amount - commission).toFixed(2));

    const payment = await this.paymentRepository.create({
      bookingId: dto.bookingId,
      amount,
      commission,
      netAmount,
      idempotencyKey: dto.idempotencyKey,
    });

    const gatewayRef = await this.paymentGateway.capture(
      dto.idempotencyKey,
      amount,
    );

    const updated = await this.paymentRepository.updateStatus(
      payment.id,
      'CAPTURED',
      gatewayRef,
    );

    await this.bookingsService.confirmPayment(dto.bookingId, dto.exactAddress);

    return updated;
  }

  async releasePayment(bookingId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findByBooking(bookingId);
    if (!payment) throw new BadRequestException('Payment not found');

    await this.paymentGateway.release(payment.gatewayRef ?? payment.id, Number(payment.netAmount));
    return this.paymentRepository.updateStatus(payment.id, 'RELEASED');
  }

  async getWorkerHistory(workerId: string): Promise<Payment[]> {
    return this.paymentRepository.findByWorker(workerId);
  }
}
