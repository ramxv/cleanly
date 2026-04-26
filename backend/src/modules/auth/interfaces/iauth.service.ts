import type { User } from '@prisma/client';
import type { RegisterDto } from '../dto/register.dto';
import type { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  register(dto: RegisterDto): Promise<{ accessToken: string; user: Partial<User> }>;
  login(dto: LoginDto): Promise<{ accessToken: string; user: Partial<User> }>;
  validateUser(id: string): Promise<User | null>;
}
