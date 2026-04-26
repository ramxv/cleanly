import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty({ enum: Role }) role!: Role;
  @ApiProperty() isVerified!: boolean;
  @ApiProperty() isSuspended!: boolean;
  @ApiProperty() createdAt!: Date;

  @Exclude()
  passwordHash?: string | null;
}
