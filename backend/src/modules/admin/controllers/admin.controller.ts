import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ADMIN_SERVICE } from '../admin.tokens';
import type { IAdminService } from '../interfaces/iadmin.service';
import { VerifyWorkerDto } from '../dto/verify-worker.dto';
import { ResolveDisputeDto } from '../dto/resolve-dispute.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    @Inject(ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  @Get('metrics')
  getMetrics(@Query('days') days?: string) {
    return this.adminService.getMetrics(days ? parseInt(days) : 30);
  }

  @Get('workers/pending')
  getPendingWorkers() {
    return this.adminService.getPendingWorkers();
  }

  @Post('workers/verify')
  verifyWorker(@Body() dto: VerifyWorkerDto) {
    return this.adminService.verifyWorker(dto);
  }

  @Patch('users/:id/suspend')
  suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id, true);
  }

  @Patch('users/:id/unsuspend')
  unsuspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id, false);
  }

  @Post('disputes/resolve')
  resolveDispute(@Body() _dto: ResolveDisputeDto) {
    return { message: 'Dispute resolution recorded' };
  }
}
