import { IsDateString, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  requestId!: string;

  @ApiProperty()
  @IsString()
  workerId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty()
  @IsDateString()
  scheduledAt!: string;

  @ApiProperty()
  @IsString()
  exactAddress!: string;
}
