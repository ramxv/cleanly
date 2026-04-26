import { Module } from '@nestjs/common';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { ReviewRepository } from './repositories/review.repository';
import { AuthModule } from '../auth/auth.module';
import { REVIEW_REPOSITORY } from './services/review.tokens';

@Module({
  imports: [AuthModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    { provide: REVIEW_REPOSITORY, useClass: ReviewRepository },
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
