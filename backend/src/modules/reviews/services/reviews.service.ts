import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { REVIEW_REPOSITORY } from './review.tokens';
import type { IReviewRepository } from '../interfaces/ireview.repository';
import type { CreateReviewDto } from '../dto/create-review.dto';
import type { Review } from '@prisma/client';

const REVIEW_WINDOW_HOURS = 72;

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createReview(fromUserId: string, dto: CreateReviewDto): Promise<Review> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed bookings');
    }

    const cutoff = new Date(booking.updatedAt);
    cutoff.setHours(cutoff.getHours() + REVIEW_WINDOW_HOURS);
    if (new Date() > cutoff) {
      throw new BadRequestException('Review window has expired (72h)');
    }

    const existing = await this.reviewRepository.findByBookingAndFrom(
      dto.bookingId,
      fromUserId,
    );
    if (existing) throw new ConflictException('Already reviewed this booking');

    const review = await this.reviewRepository.create({
      bookingId: dto.bookingId,
      fromUserId,
      toUserId: dto.toUserId,
      stars: dto.stars,
      comment: dto.comment,
    });

    await this.syncWorkerRating(dto.toUserId);

    return review;
  }

  async getWorkerReviews(workerUserId: string): Promise<Review[]> {
    return this.reviewRepository.findByWorker(workerUserId);
  }

  private async syncWorkerRating(workerUserId: string): Promise<void> {
    const { avgRating, reviewCount } =
      await this.reviewRepository.getWorkerRatingAggregate(workerUserId);

    await this.prisma.workerProfile.updateMany({
      where: { userId: workerUserId },
      data: { avgRating, reviewCount },
    });

    if (avgRating > 0 && avgRating < 2.0) {
      await this.prisma.workerProfile.updateMany({
        where: { userId: workerUserId },
        data: { verificationStatus: 'REJECTED' },
      });
    }
  }
}
