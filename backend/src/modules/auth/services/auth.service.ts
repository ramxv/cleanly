import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_REPOSITORY } from '../auth.tokens';
import type { IAuthRepository } from '../interfaces/iauth.repository';
import type { IAuthService } from '../interfaces/iauth.service';
import type { RegisterDto } from '../dto/register.dto';
import type { LoginDto } from '../dto/login.dto';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.authRepository.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user?.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (user.isSuspended) throw new UnauthorizedException('Account suspended');

    return this.buildAuthResponse(user);
  }

  async validateUser(id: string): Promise<User | null> {
    return this.authRepository.findById(id);
  }

  private buildAuthResponse(user: User): { accessToken: string; user: Partial<User> } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const { passwordHash: _, ...safeUser } = user;
    return {
      accessToken: this.jwtService.sign(payload),
      user: safeUser,
    };
  }
}
