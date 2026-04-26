import type { ServiceRequest, ServiceType } from '@prisma/client';

export interface CreateServiceRequestData {
  clientId: string;
  serviceType: ServiceType;
  propertySize: number;
  bedroomCount: number;
  locationArea: string;
  scheduledAt: Date;
}

export interface IServiceRequestRepository {
  create(data: CreateServiceRequestData): Promise<ServiceRequest>;
  findById(id: string): Promise<ServiceRequest | null>;
  findByClient(clientId: string): Promise<ServiceRequest[]>;
  close(id: string): Promise<ServiceRequest>;
}
