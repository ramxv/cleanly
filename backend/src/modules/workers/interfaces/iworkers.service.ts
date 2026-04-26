import type { WorkerProfile, Availability } from '@prisma/client';
import type { CreateWorkerProfileDto } from '../dto/create-worker-profile.dto';
import type { UpdateAvailabilityDto } from '../dto/update-availability.dto';

export interface IWorkersService {
  createProfile(userId: string, dto: CreateWorkerProfileDto): Promise<WorkerProfile>;
  getProfile(id: string): Promise<WorkerProfile>;
  getProfileByUserId(userId: string): Promise<WorkerProfile>;
  updateProfile(workerId: string, userId: string, dto: Partial<CreateWorkerProfileDto>): Promise<WorkerProfile>;
  setAvailability(workerId: string, dto: UpdateAvailabilityDto): Promise<Availability>;
  getAvailability(workerId: string): Promise<Availability[]>;
  removeAvailability(availabilityId: string): Promise<void>;
  recalculateRating(workerId: string, avgRating: number, reviewCount: number): Promise<void>;
}
