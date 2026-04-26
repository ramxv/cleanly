import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type {
  IReviewRepository,
  CreateReviewData,
  WorkerRatingAggregate,
} from '../interfaces/ireview.repository';
import type { Review } from '@prisma/client';

const MIN_REVIEWS_VISIBLE = 5;

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReviewData): Promise<Review> {
    return this.prisma.review.create({ data });
  }

  findByBookingAndFrom(bookingId: string, fromUserId: string): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { bookingId_fromUserId: { bookingId, fromUserId } },
    });
  }

  async getWorkerRatingAggregate(toUserId: string): Promise<WorkerRatingAggregate> {
    const result = await this.prisma.review.aggregate({
      where: { toUserId, isModerated: false },
      _avg: { stars: true },
      _count: { stars: true },
    });
    const reviewCount = result._count.stars;
    return {
      avgRating: reviewCount >= MIN_REVIEWS_VISIBLE ? (result._avg.stars ?? 0) : 0,
      reviewCount,
    };
  }

  findByWorker(toUserId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { toUserId, isModerated: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  delete(id: string): Promise<void> {
    return this.prisma.review.delete({ where: { id } }).then(() => undefined);
  }
}
