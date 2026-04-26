import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum DisputeResolution {
  REFUND_CLIENT = 'REFUND_CLIENT',
  RELEASE_WORKER = 'RELEASE_WORKER',
}

export class ResolveDisputeDto {
  @ApiProperty()
  @IsString()
  bookingId!: string;

  @ApiProperty({ enum: DisputeResolution })
  @IsEnum(DisputeResolution)
  resolution!: DisputeResolution;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
