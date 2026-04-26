import type { WorkerProfile } from '@prisma/client';
import type { ServiceRequest } from '@prisma/client';

export interface IMatchingStrategy {
  findMatches(request: ServiceRequest): Promise<WorkerProfile[]>;
}
