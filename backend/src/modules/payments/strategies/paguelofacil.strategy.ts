import type { IPaymentStrategy } from '../interfaces/ipayment-strategy';
import type { ProcessPaymentDto } from '../dto/process-payment.dto';
import type { IPaymentGateway } from '../../../infrastructure/payments/ipayment-gateway.interface';
import type { PaymentTransaction } from '@prisma/client';

export class PagueloFacilStrategy implements IPaymentStrategy {
  get providerName(): string {
    return 'PAGUELOFACIL';
  }

  async process(dto: ProcessPaymentDto, gateway: IPaymentGateway): Promise<PaymentTransaction> {
    // Ejemplo de implementación de procesamiento vía Páguelo Fácil usando el gateway infrastructure
    const txId = await gateway.capture(dto.idempotencyKey, dto.amount);
    
    return {
      id: 'tx_mock_id',
      bookingId: dto.bookingId,
      amount: dto.amount,
      providerTransactionId: txId,
      paymentMethod: 'CREDIT_CARD',
      status: 'SUCCESS',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PaymentTransaction;
  }
}
