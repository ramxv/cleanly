import type { User } from '@/utils/types';
import { getStore, delay } from '@/utils/storage';

interface LoginResponse {
  user: User;
  token: string;
}

export async function loginService(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const users = getStore<User>('cleanly_users');
  const user = users.find((u) => u.email === email);

  if (!user) {
    return delay(null as never).then(() => {
      throw new Error('Correo no registrado');
    });
  }

  if (user.password !== password) {
    return delay(null as never).then(() => {
      throw new Error('Contraseña incorrecta');
    });
  }

  // Token falso (simulado)
  const token = btoa(
    JSON.stringify({ sub: user.id, email: user.email, rol: user.rol }),
  );

  return delay({ user: { ...user, password: '' }, token });
}
