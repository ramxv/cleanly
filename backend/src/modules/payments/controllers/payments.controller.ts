import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PAYMENT_SERVICE } from '../payments.tokens';
import type { IPaymentsService } from '../interfaces/ipayments.service';
import { ProcessPaymentDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentsService: IPaymentsService,
  ) {}

  @Post()
  @Roles(Role.CLIENT)
  processPayment(@Body() dto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(dto);
  }

  @Get('history')
  @Roles(Role.WORKER)
  getHistory(@CurrentUser() user: User) {
    return this.paymentsService.getWorkerHistory(user.id);
  }
}
