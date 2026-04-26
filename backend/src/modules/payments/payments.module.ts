import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { PaymentRepository } from './repositories/payment.repository';
import { AuthModule } from '../auth/auth.module';
import { BookingsModule } from '../bookings/bookings.module';
import { InfraPaymentsModule } from '../../infrastructure/payments/payments.module';
import { PAYMENT_REPOSITORY, PAYMENT_SERVICE } from './payments.tokens';

export const PAYMENT_STRATEGIES = 'PAYMENT_STRATEGIES';

@Module({
  imports: [AuthModule, BookingsModule, InfraPaymentsModule],
  controllers: [PaymentsController],
  providers: [
    { provide: PAYMENT_SERVICE, useClass: PaymentsService },
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
  ],
  exports: [PAYMENT_SERVICE],
})
export class PaymentsModule {}
