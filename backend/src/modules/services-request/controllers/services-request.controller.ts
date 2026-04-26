import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ServicesRequestService } from '../services/services-request.service';
import { CreateServiceRequestDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('service-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('service-requests')
export class ServicesRequestController {
  constructor(private readonly service: ServicesRequestService) {}

  @Post()
  @Roles(Role.CLIENT)
  create(@CurrentUser() user: User, @Body() dto: CreateServiceRequestDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  @Roles(Role.CLIENT)
  getMyRequests(@CurrentUser() user: User) {
    return this.service.getMyRequests(user.id);
  }

  @Get(':id/matches')
  @Roles(Role.CLIENT)
  getMatches(@Param('id') id: string) {
    return this.service.getMatches(id);
  }
}
