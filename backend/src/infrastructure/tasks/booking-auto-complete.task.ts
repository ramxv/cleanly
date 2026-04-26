import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from '../../modules/bookings/services/bookings.service';
import { LoyaltyService } from '../../modules/loyalty/services/loyalty.service';
import { PrismaService } from '../../prisma/prisma.service';

const AUTO_COMPLETE_BUFFER_HOURS = 2;

@Injectable()
export class BookingAutoCompleteTask {
  private readonly logger = new Logger(BookingAutoCompleteTask.name);

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly loyaltyService: LoyaltyService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async autoCompleteExpired(): Promise<void> {
    const cutoff = new Date(
      Date.now() - AUTO_COMPLETE_BUFFER_HOURS * 60 * 60 * 1000,
    );
    await this.bookingsService.autoComplete(cutoff);
    this.logger.log('Auto-complete task ran');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireCoupons(): Promise<void> {
    const expired = await this.loyaltyService.expireOldCoupons();
    this.logger.log(`Expired ${expired} loyalty coupons`);
  }
}
