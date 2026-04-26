import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class AuthResponseEntity {
  @ApiProperty() accessToken!: string;
  @ApiProperty({ type: UserEntity }) user!: Partial<UserEntity>;
}
