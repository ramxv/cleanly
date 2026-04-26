import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { LoyaltyService } from '../services/loyalty.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PrismaService } from '../../../prisma/prisma.service';
import type { User } from '@prisma/client';

@ApiTags('loyalty')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loyalty')
export class LoyaltyController {
  constructor(
    private readonly loyaltyService: LoyaltyService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('coupon')
  @Roles(Role.CLIENT)
  async getActiveCoupon(@CurrentUser() user: User) {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId: user.id },
    });
    if (!profile) return null;
    return this.loyaltyService.getActiveCoupon(profile.id);
  }
}
