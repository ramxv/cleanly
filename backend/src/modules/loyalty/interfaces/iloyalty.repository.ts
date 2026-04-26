import type { LoyaltyCoupon } from '@prisma/client';

export interface ILoyaltyRepository {
  incrementCount(clientId: string): Promise<number>;
  issueCoupon(clientId: string, value: number): Promise<LoyaltyCoupon>;
  findActiveCoupon(clientId: string): Promise<LoyaltyCoupon | null>;
  redeemCoupon(id: string, bookingId: string): Promise<LoyaltyCoupon>;
  expireOldCoupons(): Promise<number>;
}
