import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { IBookingRepository, CreateBookingData } from '../interfaces/ibooking.repository';
import type { Booking, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateBookingData): Promise<Booking> {
    return this.prisma.booking.create({ data });
  }

  findById(id: string): Promise<Booking | null> {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { request: true, payment: true },
    }) as Promise<Booking | null>;
  }

  findByWorker(workerId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { workerId },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  findByClient(clientId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { request: { client: { userId: clientId } } },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  updateStatus(
    id: string,
    status: BookingStatus,
    extra?: Partial<Booking>,
  ): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: { status, ...extra },
    });
  }

  setExactAddress(id: string, address: string): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: { exactAddress: address },
    });
  }

  findExpiredInProgress(cutoff: Date): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        status: 'IN_PROGRESS',
        estimatedEndAt: { lte: cutoff },
      },
    });
  }
}
