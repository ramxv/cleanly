import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SERVICE_REQUEST_REPOSITORY, MATCHING_STRATEGY } from '../services-request.tokens';
import type { IServiceRequestRepository } from '../interfaces/iservice-request.repository';
import type { IMatchingStrategy } from '../interfaces/imatching.strategy';
import type { CreateServiceRequestDto } from '../dto/create-service-request.dto';
import type { ServiceRequest, WorkerProfile } from '@prisma/client';

const MIN_HOURS_AHEAD = 24;

@Injectable()
export class ServicesRequestService {
  constructor(
    @Inject(SERVICE_REQUEST_REPOSITORY)
    private readonly serviceRequestRepository: IServiceRequestRepository,
    @Inject(MATCHING_STRATEGY)
    private readonly matchingStrategy: IMatchingStrategy,
  ) {}

  async create(clientId: string, dto: CreateServiceRequestDto): Promise<ServiceRequest> {
    const scheduledAt = new Date(dto.scheduledAt);
    const minAllowed = new Date(Date.now() + MIN_HOURS_AHEAD * 60 * 60 * 1000);

    if (scheduledAt < minAllowed) {
      throw new BadRequestException(
        `Service must be scheduled at least ${MIN_HOURS_AHEAD} hours in advance`,
      );
    }

    return this.serviceRequestRepository.create({
      clientId,
      serviceType: dto.serviceType,
      propertySize: dto.propertySize,
      bedroomCount: dto.bedroomCount,
      locationArea: dto.locationArea,
      scheduledAt,
    });
  }

  async getMatches(requestId: string): Promise<WorkerProfile[]> {
    const request = await this.serviceRequestRepository.findById(requestId);
    if (!request) throw new NotFoundException('Service request not found');
    return this.matchingStrategy.findMatches(request);
  }

  async getMyRequests(clientId: string): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.findByClient(clientId);
  }
}
