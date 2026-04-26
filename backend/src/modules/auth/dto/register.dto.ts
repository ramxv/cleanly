import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateUserData } from '../interfaces/iauth.repository';

const ALLOWED_ROLES = [Role.CLIENT, Role.WORKER] as const;
type RegisterRole = (typeof ALLOWED_ROLES)[number];

export class RegisterDto implements Omit<CreateUserData, 'passwordHash'> {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: ALLOWED_ROLES })
  @IsEnum(ALLOWED_ROLES)
  role!: RegisterRole;
}
