import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WORKER_REPOSITORY } from '../workers.tokens';
import type { IWorkerRepository } from '../interfaces/iworker.repository';
import type { CreateWorkerProfileDto } from '../dto/create-worker-profile.dto';
import type { UpdateAvailabilityDto } from '../dto/update-availability.dto';
import type { WorkerProfile, Availability } from '@prisma/client';
import type { IWorkersService } from '../interfaces/iworkers.service';

@Injectable()
export class WorkersService implements IWorkersService {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async createProfile(userId: string, dto: CreateWorkerProfileDto): Promise<WorkerProfile> {
    return this.workerRepository.create({ userId, ...dto });
  }

  async getProfile(id: string): Promise<WorkerProfile> {
    const profile = await this.workerRepository.findById(id);
    if (!profile) throw new NotFoundException('Worker profile not found');
    return profile;
  }

  async getProfileByUserId(userId: string): Promise<WorkerProfile> {
    const profile = await this.workerRepository.findByUserId(userId);
    if (!profile) throw new NotFoundException('Worker profile not found');
    return profile;
  }

  async updateProfile(
    workerId: string,
    userId: string,
    dto: Partial<CreateWorkerProfileDto>,
  ): Promise<WorkerProfile> {
    const profile = await this.getProfile(workerId);
    if (profile.userId !== userId) throw new ForbiddenException();
    return this.workerRepository.update(workerId, dto);
  }

  async setAvailability(workerId: string, dto: UpdateAvailabilityDto): Promise<Availability> {
    return this.workerRepository.upsertAvailability({ workerId, ...dto });
  }

  async getAvailability(workerId: string): Promise<Availability[]> {
    return this.workerRepository.findAvailabilityByWorker(workerId);
  }

  async removeAvailability(availabilityId: string): Promise<void> {
    return this.workerRepository.deleteAvailability(availabilityId);
  }

  async recalculateRating(workerId: string, avgRating: number, reviewCount: number): Promise<void> {
    await this.workerRepository.updateRating(workerId, avgRating, reviewCount);
  }
}
