import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';
import { CreateWorkerProfileData } from '../interfaces/iworker.repository';

export class CreateWorkerProfileDto implements Omit<CreateWorkerProfileData, 'userId'> {
  @ApiProperty()
  @IsString()
  fullName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: [String], enum: ServiceType })
  @IsOptional()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  serviceTypes?: ServiceType[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}
