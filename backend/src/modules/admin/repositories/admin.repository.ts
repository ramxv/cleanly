import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { IAdminRepository, PlatformMetrics } from '../interfaces/iadmin.repository';
import type { WorkerProfile, User } from '@prisma/client';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  getPendingWorkers(): Promise<WorkerProfile[]> {
    return this.prisma.workerProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: { user: { select: { email: true } } },
    }) as Promise<WorkerProfile[]>;
  }

  async getMetrics(since: Date): Promise<PlatformMetrics> {
    const [activeBookings, completedBookings, totalUsers, newUsers, commissions] =
      await Promise.all([
        this.prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'IN_PROGRESS'] } } }),
        this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
        this.prisma.user.count(),
        this.prisma.user.count({ where: { createdAt: { gte: since } } }),
        this.prisma.payment.aggregate({
          where: { status: 'RELEASED' },
          _sum: { commission: true },
        }),
      ]);

    return {
      activeBookings,
      completedBookings,
      totalUsers,
      newUsersThisPeriod: newUsers,
      totalCommission: Number(commissions._sum.commission ?? 0),
    };
  }

  suspendUser(id: string, suspended: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isSuspended: suspended },
    });
  }
}
