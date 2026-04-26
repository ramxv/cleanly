import { Module } from '@nestjs/common';
import { LoyaltyController } from './controllers/loyalty.controller';
import { LoyaltyService } from './services/loyalty.service';
import { LoyaltyRepository } from './repositories/loyalty.repository';
import { AuthModule } from '../auth/auth.module';
import { LOYALTY_REPOSITORY } from './loyalty.tokens';

@Module({
  imports: [AuthModule],
  controllers: [LoyaltyController],
  providers: [
    LoyaltyService,
    { provide: LOYALTY_REPOSITORY, useClass: LoyaltyRepository },
  ],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}
