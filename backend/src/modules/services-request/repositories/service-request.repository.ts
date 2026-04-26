import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type {
  IServiceRequestRepository,
  CreateServiceRequestData,
} from '../interfaces/iservice-request.repository';
import type { ServiceRequest } from '@prisma/client';

@Injectable()
export class ServiceRequestRepository implements IServiceRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateServiceRequestData): Promise<ServiceRequest> {
    return this.prisma.serviceRequest.create({ data });
  }

  findById(id: string): Promise<ServiceRequest | null> {
    return this.prisma.serviceRequest.findUnique({ where: { id } });
  }

  findByClient(clientId: string): Promise<ServiceRequest[]> {
    return this.prisma.serviceRequest.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  close(id: string): Promise<ServiceRequest> {
    return this.prisma.serviceRequest.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
  }
}
