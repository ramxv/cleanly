import { Inject, Injectable } from '@nestjs/common';
import { ADMIN_REPOSITORY } from '../admin.tokens';
import { WORKER_REPOSITORY } from '../../workers/workers.tokens';
import type { IAdminService } from '../interfaces/iadmin.service';
import type { IAdminRepository, PlatformMetrics } from '../interfaces/iadmin.repository';
import type { IWorkerRepository } from '../../workers/interfaces/iworker.repository';
import type { VerifyWorkerDto } from '../dto/verify-worker.dto';
import type { WorkerProfile, User } from '@prisma/client';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: IWorkerRepository,
  ) {}

  getPendingWorkers(): Promise<WorkerProfile[]> {
    return this.adminRepository.getPendingWorkers();
  }

  verifyWorker(dto: VerifyWorkerDto): Promise<WorkerProfile> {
    return this.workerRepository.updateVerificationStatus(
      dto.workerProfileId,
      dto.status,
    );
  }

  getMetrics(days = 30): Promise<PlatformMetrics> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.adminRepository.getMetrics(since);
  }

  suspendUser(userId: string, suspended: boolean): Promise<User> {
    return this.adminRepository.suspendUser(userId, suspended);
  }
}
