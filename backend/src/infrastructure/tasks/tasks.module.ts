import { Module } from '@nestjs/common';
import { BookingAutoCompleteTask } from './booking-auto-complete.task';
import { BookingsModule } from '../../modules/bookings/bookings.module';
import { LoyaltyModule } from '../../modules/loyalty/loyalty.module';

@Module({
  imports: [BookingsModule, LoyaltyModule],
  providers: [BookingAutoCompleteTask],
})
export class TasksModule {}
