import type { PlatformMetrics } from './iadmin.repository';
import type { VerifyWorkerDto } from '../dto/verify-worker.dto';
import type { WorkerProfile, User } from '@prisma/client';

export interface IAdminService {
  getPendingWorkers(): Promise<WorkerProfile[]>;
  verifyWorker(dto: VerifyWorkerDto): Promise<WorkerProfile>;
  getMetrics(days?: number): Promise<PlatformMetrics>;
  suspendUser(userId: string, suspended: boolean): Promise<User>;
}
