import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { BookingsService } from './services/bookings.service';
import { BookingRepository } from './repositories/booking.repository';
import { AuthModule } from '../auth/auth.module';
import { BOOKING_REPOSITORY, BOOKING_SERVICE } from './bookings.tokens';

@Module({
  imports: [AuthModule],
  controllers: [BookingsController],
  providers: [
    { provide: BOOKING_SERVICE, useClass: BookingsService },
    { provide: BOOKING_REPOSITORY, useClass: BookingRepository },
  ],
  exports: [BOOKING_SERVICE],
})
export class BookingsModule {}
