import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IPaymentGateway } from './ipayment-gateway.interface';

@Injectable()
export class PagueloFacilService implements IPaymentGateway {
  private readonly logger = new Logger(PagueloFacilService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.apiKey = config.get<string>('PAGUELOFACIL_API_KEY', '');
    this.baseUrl = config.get<string>('PAGUELOFACIL_BASE_URL', '');
  }

  async capture(idempotencyKey: string, amount: number): Promise<string> {
    this.logger.log(`Capturing $${amount} [key=${idempotencyKey}]`);
    // TODO: implement real PagueloFácil API call with 3DS 2.0
    return `pf_${idempotencyKey}_${Date.now()}`;
  }

  async release(gatewayRef: string, amount: number): Promise<void> {
    this.logger.log(`Releasing $${amount} to worker [ref=${gatewayRef}]`);
    // TODO: implement real transfer/payout call
  }

  async refund(gatewayRef: string, amount: number): Promise<void> {
    this.logger.log(`Refunding $${amount} [ref=${gatewayRef}]`);
    // TODO: implement real refund call
  }
}
