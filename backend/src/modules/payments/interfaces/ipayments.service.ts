import type { ProcessPaymentDto } from '../dto/process-payment.dto';
import type { Payment } from '@prisma/client';

export interface IPaymentsService {
  processPayment(dto: ProcessPaymentDto): Promise<Payment>;
  releasePayment(bookingId: string): Promise<Payment>;
  getWorkerHistory(workerId: string): Promise<Payment[]>;
}
