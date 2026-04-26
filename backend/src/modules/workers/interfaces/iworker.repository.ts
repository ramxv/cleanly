import type { WorkerProfile, Availability, VerificationStatus, ServiceType } from '@prisma/client';

export interface CreateWorkerProfileData {
  userId: string;
  fullName: string;
  bio?: string;
  hourlyRate?: number;
}

export interface UpdateWorkerProfileData {
  fullName?: string;
  bio?: string;
  hourlyRate?: number;
}

export interface WorkerSearchFilters {
  serviceType?: ServiceType;
  minRating?: number;
  maxHourlyRate?: number;
  dayOfWeek?: number;
  zone?: string;
}

export interface CreateAvailabilityData {
  workerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  serviceZones: string[];
}

export interface IWorkerRepository {
  findById(id: string): Promise<WorkerProfile | null>;
  findByUserId(userId: string): Promise<WorkerProfile | null>;
  create(data: CreateWorkerProfileData): Promise<WorkerProfile>;
  update(id: string, data: UpdateWorkerProfileData): Promise<WorkerProfile>;
  findAvailable(filters: WorkerSearchFilters): Promise<WorkerProfile[]>;
  updateVerificationStatus(id: string, status: VerificationStatus): Promise<WorkerProfile>;
  addDocumentUrl(id: string, url: string): Promise<WorkerProfile>;
  updateRating(id: string, avgRating: number, reviewCount: number): Promise<WorkerProfile>;
  upsertAvailability(data: CreateAvailabilityData): Promise<Availability>;
  deleteAvailability(id: string): Promise<void>;
  findAvailabilityByWorker(workerId: string): Promise<Availability[]>;
}
