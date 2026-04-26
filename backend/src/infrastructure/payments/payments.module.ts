import { Module } from '@nestjs/common';
import { PagueloFacilService } from './paguelofacil.service';
import { PAYMENT_GATEWAY } from './payments.tokens';

@Module({
  providers: [{ provide: PAYMENT_GATEWAY, useClass: PagueloFacilService }],
  exports: [PAYMENT_GATEWAY],
})
export class InfraPaymentsModule {}
