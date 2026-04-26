import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { IMatchingStrategy } from '../interfaces/imatching.strategy';
import type { ServiceRequest, WorkerProfile } from '@prisma/client';

@Injectable()
export class WorkerMatchingStrategy implements IMatchingStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async findMatches(request: ServiceRequest): Promise<WorkerProfile[]> {
    const requestDay = new Date(request.scheduledAt).getDay();

    return this.prisma.workerProfile.findMany({
      where: {
        verificationStatus: 'APPROVED',
        serviceTypes: { has: request.serviceType },
        availability: {
          some: {
            dayOfWeek: requestDay,
            serviceZones: { has: request.locationArea },
          },
        },
        bookings: {
          none: {
            status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
            scheduledAt: {
              gte: new Date(
                new Date(request.scheduledAt).setHours(0, 0, 0, 0),
              ),
              lte: new Date(
                new Date(request.scheduledAt).setHours(23, 59, 59, 999),
              ),
            },
          },
        },
      },
      orderBy: [{ isPremium: 'desc' }, { avgRating: 'desc' }],
    });
  }
}
