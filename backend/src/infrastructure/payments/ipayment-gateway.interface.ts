export interface IPaymentGateway {
  capture(idempotencyKey: string, amount: number): Promise<string>;
  release(gatewayRef: string, amount: number): Promise<void>;
  refund(gatewayRef: string, amount: number): Promise<void>;
}
