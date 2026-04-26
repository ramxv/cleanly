import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty()
  @IsString()
  bookingId!: string;

  @ApiProperty()
  @IsString()
  idempotencyKey!: string;

  @ApiProperty({ description: 'Exact client address revealed post-payment' })
  @IsString()
  exactAddress!: string;
}
