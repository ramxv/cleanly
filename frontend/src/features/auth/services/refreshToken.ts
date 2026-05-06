import type { User } from '@/utils/types';
import { getOne, delay } from '@/utils/storage';

interface TokenPayload {
  sub: string;
  email: string;
  rol: string;
}

export async function refreshTokenService(
  token: string,
): Promise<{ user: User; token: string }> {
  try {
    const payload: TokenPayload = JSON.parse(atob(token));
    const user = getOne<User>('cleanly_users', payload.sub);

    if (!user) throw new Error('Usuario no encontrado');

    const newToken = btoa(JSON.stringify(payload));
    return delay({ user: { ...user, password: '' }, token: newToken });
  } catch {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Token inválido');
  }
}
