import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '@prisma/client';

export class VerifyWorkerDto {
  @ApiProperty()
  @IsString()
  workerProfileId!: string;

  @ApiProperty({ enum: [VerificationStatus.APPROVED, VerificationStatus.REJECTED] })
  @IsEnum([VerificationStatus.APPROVED, VerificationStatus.REJECTED])
  status!: typeof VerificationStatus.APPROVED | typeof VerificationStatus.REJECTED;
}
