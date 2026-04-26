import type { WorkerProfile, User } from '@prisma/client';

export interface PlatformMetrics {
  activeBookings: number;
  completedBookings: number;
  totalUsers: number;
  newUsersThisPeriod: number;
  totalCommission: number;
}

export interface IAdminRepository {
  getPendingWorkers(): Promise<WorkerProfile[]>;
  getMetrics(since: Date): Promise<PlatformMetrics>;
  suspendUser(id: string, suspended: boolean): Promise<User>;
}
