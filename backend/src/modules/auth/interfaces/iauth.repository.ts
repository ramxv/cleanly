import type { User, Role } from '@prisma/client';

export interface CreateUserData {
  email: string;
  passwordHash?: string;
  role: Role;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  suspend(id: string, isSuspended: boolean): Promise<User>;
}
