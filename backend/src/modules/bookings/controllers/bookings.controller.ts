import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { BOOKING_SERVICE } from '../bookings.tokens';
import type { IBookingsService } from '../interfaces/ibookings.service';
import { CreateBookingDto, CancelBookingDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(
    @Inject(BOOKING_SERVICE)
    private readonly bookingsService: IBookingsService,
  ) {}

  @Post()
  @Roles(Role.CLIENT)
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.bookingsService.getById(id);
  }

  @Patch(':id/start')
  @Roles(Role.WORKER)
  startService(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.startService(id, user.id);
  }

  @Patch(':id/complete')
  @Roles(Role.WORKER)
  completeService(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.completeService(id, user.id);
  }

  @Patch(':id/cancel/client')
  @Roles(Role.CLIENT)
  cancelByClient(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelByClient(id, user.id, dto);
  }

  @Patch(':id/cancel/worker')
  @Roles(Role.WORKER)
  cancelByWorker(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelByWorker(id, user.id, dto);
  }
}
