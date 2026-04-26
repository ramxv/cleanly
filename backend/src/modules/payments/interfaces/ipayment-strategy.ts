import type { IPaymentGateway } from '../../../infrastructure/payments/ipayment-gateway.interface';
import type { ProcessPaymentDto } from '../dto/process-payment.dto';
import type { PaymentTransaction } from '@prisma/client';

export interface IPaymentStrategy {
  get providerName(): string;
  process(dto: ProcessPaymentDto, gateway: IPaymentGateway): Promise<PaymentTransaction>;
}
