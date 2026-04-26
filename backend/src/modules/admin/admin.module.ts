import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { AdminRepository } from './repositories/admin.repository';
import { WorkerRepository } from '../workers/repositories/worker.repository';
import { AuthModule } from '../auth/auth.module';
import { ADMIN_REPOSITORY, ADMIN_SERVICE } from './admin.tokens';
import { WORKER_REPOSITORY } from '../workers/workers.tokens';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [
    { provide: ADMIN_SERVICE, useClass: AdminService },
    { provide: ADMIN_REPOSITORY, useClass: AdminRepository },
    { provide: WORKER_REPOSITORY, useClass: WorkerRepository },
  ],
})
export class AdminModule {}
