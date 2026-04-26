import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { ILoyaltyRepository } from '../interfaces/iloyalty.repository';
import type { LoyaltyCoupon } from '@prisma/client';

const COUPON_VALIDITY_DAYS = 90;
const COUPON_MAX_VALUE = 50;
const LOYALTY_THRESHOLD = 10;

@Injectable()
export class LoyaltyRepository implements ILoyaltyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async incrementCount(clientId: string): Promise<number> {
    const profile = await this.prisma.clientProfile.update({
      where: { id: clientId },
      data: { loyaltyCount: { increment: 1 } },
    });
    return profile.loyaltyCount;
  }

  async issueCoupon(clientId: string, value: number): Promise<LoyaltyCoupon> {
    const cappedValue = Math.min(value, COUPON_MAX_VALUE);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + COUPON_VALIDITY_DAYS);

    await this.prisma.clientProfile.update({
      where: { id: clientId },
      data: { loyaltyCount: 0 },
    });

    return this.prisma.loyaltyCoupon.create({
      data: { clientId, value: cappedValue, expiresAt },
    });
  }

  findActiveCoupon(clientId: string): Promise<LoyaltyCoupon | null> {
    return this.prisma.loyaltyCoupon.findFirst({
      where: {
        clientId,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  redeemCoupon(id: string, bookingId: string): Promise<LoyaltyCoupon> {
    return this.prisma.loyaltyCoupon.update({
      where: { id },
      data: { isUsed: true, usedAt: new Date(), bookingIdUsed: bookingId },
    });
  }

  async expireOldCoupons(): Promise<number> {
    const result = await this.prisma.loyaltyCoupon.updateMany({
      where: { isUsed: false, expiresAt: { lt: new Date() } },
      data: { isUsed: true },
    });
    return result.count;
  }
}

export { LOYALTY_THRESHOLD };
