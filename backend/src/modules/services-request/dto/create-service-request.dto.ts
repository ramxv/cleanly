import { IsDateString, IsEnum, IsInt, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';

export class CreateServiceRequestDto {
  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  propertySize!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  bedroomCount!: number;

  @ApiProperty()
  @IsString()
  locationArea!: string;

  @ApiProperty()
  @IsDateString()
  scheduledAt!: string;
}
