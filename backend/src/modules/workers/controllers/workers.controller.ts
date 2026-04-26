import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateWorkerProfileDto, UpdateAvailabilityDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { WORKER_SERVICE } from '../workers.tokens';
import type { IWorkersService } from '../interfaces/iworkers.service';
import type { User } from '@prisma/client';

@ApiTags('workers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workers')
export class WorkersController {
  constructor(
    @Inject(WORKER_SERVICE)
    private readonly workersService: IWorkersService,
  ) {}

  @Post('profile')
  @Roles(Role.WORKER)
  createProfile(
    @CurrentUser() user: User,
    @Body() dto: CreateWorkerProfileDto,
  ) {
    return this.workersService.createProfile(user.id, dto);
  }

  @Get('profile/me')
  @Roles(Role.WORKER)
  getMyProfile(@CurrentUser() user: User) {
    return this.workersService.getProfileByUserId(user.id);
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.workersService.getProfile(id);
  }

  @Put('profile/:id')
  @Roles(Role.WORKER)
  updateProfile(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateWorkerProfileDto,
  ) {
    return this.workersService.updateProfile(id, user.id, dto);
  }

  @Post('profile/:workerId/availability')
  @Roles(Role.WORKER)
  setAvailability(
    @Param('workerId') workerId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.workersService.setAvailability(workerId, dto);
  }

  @Get('profile/:workerId/availability')
  getAvailability(@Param('workerId') workerId: string) {
    return this.workersService.getAvailability(workerId);
  }

  @Delete('availability/:id')
  @Roles(Role.WORKER)
  removeAvailability(@Param('id') id: string) {
    return this.workersService.removeAvailability(id);
  }
}
