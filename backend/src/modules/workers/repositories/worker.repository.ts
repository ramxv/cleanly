import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type {
  IWorkerRepository,
  CreateWorkerProfileData,
  UpdateWorkerProfileData,
  WorkerSearchFilters,
  CreateAvailabilityData,
} from '../interfaces/iworker.repository';
import type { WorkerProfile, Availability, VerificationStatus } from '@prisma/client';

@Injectable()
export class WorkerRepository implements IWorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<WorkerProfile | null> {
    return this.prisma.workerProfile.findUnique({ where: { id } });
  }

  findByUserId(userId: string): Promise<WorkerProfile | null> {
    return this.prisma.workerProfile.findUnique({ where: { userId } });
  }

  create(data: CreateWorkerProfileData): Promise<WorkerProfile> {
    return this.prisma.workerProfile.create({ data });
  }

  update(id: string, data: UpdateWorkerProfileData): Promise<WorkerProfile> {
    return this.prisma.workerProfile.update({ where: { id }, data });
  }

  findAvailable(filters: WorkerSearchFilters): Promise<WorkerProfile[]> {
    return this.prisma.workerProfile.findMany({
      where: {
        verificationStatus: 'APPROVED',
        avgRating: filters.minRating ? { gte: filters.minRating } : undefined,
        hourlyRate: filters.maxHourlyRate
          ? { lte: filters.maxHourlyRate }
          : undefined,
        ...(filters.serviceType && {
          serviceTypes: { has: filters.serviceType },
        }),
        ...(filters.dayOfWeek !== undefined && {
          availability: {
            some: {
              dayOfWeek: filters.dayOfWeek,
              ...(filters.zone && { serviceZones: { has: filters.zone } }),
            },
          },
        }),
      },
      orderBy: [{ isPremium: 'desc' }, { avgRating: 'desc' }],
    });
  }

  updateVerificationStatus(id: string, status: VerificationStatus): Promise<WorkerProfile> {
    return this.prisma.workerProfile.update({
      where: { id },
      data: { verificationStatus: status },
    });
  }

  addDocumentUrl(id: string, url: string): Promise<WorkerProfile> {
    return this.prisma.workerProfile.update({
      where: { id },
      data: { documentUrls: { push: url } },
    });
  }

  updateRating(id: string, avgRating: number, reviewCount: number): Promise<WorkerProfile> {
    return this.prisma.workerProfile.update({
      where: { id },
      data: { avgRating, reviewCount },
    });
  }

  upsertAvailability(data: CreateAvailabilityData): Promise<Availability> {
    return this.prisma.availability.create({ data });
  }

  deleteAvailability(id: string): Promise<void> {
    return this.prisma.availability
      .delete({ where: { id } })
      .then(() => undefined);
  }

  findAvailabilityByWorker(workerId: string): Promise<Availability[]> {
    return this.prisma.availability.findMany({ where: { workerId } });
  }
}
