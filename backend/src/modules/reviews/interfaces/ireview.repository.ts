import type { Review } from '@prisma/client';

export interface CreateReviewData {
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment?: string;
}

export interface WorkerRatingAggregate {
  avgRating: number;
  reviewCount: number;
}

export interface IReviewRepository {
  create(data: CreateReviewData): Promise<Review>;
  findByBookingAndFrom(bookingId: string, fromUserId: string): Promise<Review | null>;
  getWorkerRatingAggregate(toUserId: string): Promise<WorkerRatingAggregate>;
  findByWorker(toUserId: string): Promise<Review[]>;
  delete(id: string): Promise<void>;
}
