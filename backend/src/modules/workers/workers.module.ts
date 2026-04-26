import { Module } from '@nestjs/common';
import { WorkersController } from './controllers/workers.controller';
import { WorkersService } from './services/workers.service';
import { WorkerRepository } from './repositories/worker.repository';
import { AuthModule } from '../auth/auth.module';
import { WORKER_REPOSITORY, WORKER_SERVICE } from './workers.tokens';

@Module({
  imports: [AuthModule],
  controllers: [WorkersController],
  providers: [
    { provide: WORKER_SERVICE, useClass: WorkersService },
    { provide: WORKER_REPOSITORY, useClass: WorkerRepository },
  ],
  exports: [WORKER_SERVICE],
})
export class WorkersModule {}
