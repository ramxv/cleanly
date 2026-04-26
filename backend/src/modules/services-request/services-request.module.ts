import { Module } from '@nestjs/common';
import { ServicesRequestController } from './controllers/services-request.controller';
import { ServicesRequestService } from './services/services-request.service';
import { ServiceRequestRepository } from './repositories/service-request.repository';
import { WorkerMatchingStrategy } from './strategies/worker-matching.strategy';
import { AuthModule } from '../auth/auth.module';
import {
  SERVICE_REQUEST_REPOSITORY,
  MATCHING_STRATEGY,
} from './services-request.tokens';

@Module({
  imports: [AuthModule],
  controllers: [ServicesRequestController],
  providers: [
    ServicesRequestService,
    WorkerMatchingStrategy,
    { provide: SERVICE_REQUEST_REPOSITORY, useClass: ServiceRequestRepository },
    { provide: MATCHING_STRATEGY, useClass: WorkerMatchingStrategy },
  ],
  exports: [ServicesRequestService],
})
export class ServicesRequestModule {}
