import { IsArray, IsInt, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAvailabilityData } from '../interfaces/iworker.repository';

export class UpdateAvailabilityDto implements Omit<CreateAvailabilityData, 'workerId'> {
  @ApiProperty({ minimum: 0, maximum: 6, description: '0=Sunday, 6=Saturday' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ example: '08:00' })
  @IsString()
  startTime!: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  endTime!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  serviceZones!: string[];
}
