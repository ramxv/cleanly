import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkersModule } from './modules/workers/workers.module';
import { ServicesRequestModule } from './modules/services-request/services-request.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { AdminModule } from './modules/admin/admin.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { InfraPaymentsModule } from './infrastructure/payments/payments.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { TasksModule } from './infrastructure/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    WorkersModule,
    ServicesRequestModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    LoyaltyModule,
    AdminModule,
    StorageModule,
    InfraPaymentsModule,
    MailModule,
    TasksModule,
  ],
})
export class AppModule {}
