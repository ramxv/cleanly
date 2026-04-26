import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { LOYALTY_REPOSITORY } from '../loyalty.tokens';
import type { ILoyaltyRepository } from '../interfaces/iloyalty.repository';
import type { LoyaltyCoupon } from '@prisma/client';

const LOYALTY_THRESHOLD = 10;

@Injectable()
export class LoyaltyService {
  constructor(
    @Inject(LOYALTY_REPOSITORY)
    private readonly loyaltyRepository: ILoyaltyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async onBookingCompleted(clientProfileId: string, servicePrice: number): Promise<void> {
    const count = await this.loyaltyRepository.incrementCount(clientProfileId);
    if (count >= LOYALTY_THRESHOLD) {
      await this.loyaltyRepository.issueCoupon(clientProfileId, servicePrice);
    }
  }

  async getActiveCoupon(clientProfileId: string): Promise<LoyaltyCoupon | null> {
    return this.loyaltyRepository.findActiveCoupon(clientProfileId);
  }

  async redeemCoupon(clientProfileId: string, bookingId: string): Promise<LoyaltyCoupon | null> {
    const coupon = await this.loyaltyRepository.findActiveCoupon(clientProfileId);
    if (!coupon) return null;
    return this.loyaltyRepository.redeemCoupon(coupon.id, bookingId);
  }

  async expireOldCoupons(): Promise<number> {
    return this.loyaltyRepository.expireOldCoupons();
  }
}
