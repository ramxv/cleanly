import type { IPaymentStrategy } from '../interfaces/ipayment-strategy';
import type { ProcessPaymentDto } from '../dto/process-payment.dto';
import type { IPaymentGateway } from '../../../infrastructure/payments/ipayment-gateway.interface';
import type { Payment } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/index-browser';

export class PagueloFacilStrategy implements IPaymentStrategy {
	get providerName(): string {
		return 'PAGUELOFACIL';
	}

	async process(dto: ProcessPaymentDto, gateway: IPaymentGateway): Promise<Payment> {
		const gatewayRef = await gateway.capture(dto.idempotencyKey, 0);

		return {
			id: 'tx_mock_id',
			bookingId: dto.bookingId,
			amount: new Decimal(0),
			commission: new Decimal(0),
			netAmount: new Decimal(0),
			status: PaymentStatus.CAPTURED,
			gatewayRef,
			idempotencyKey: dto.idempotencyKey,
			createdAt: new Date(),
			updatedAt: new Date(),
		} satisfies Payment;
	}
}
