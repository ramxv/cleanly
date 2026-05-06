import type { User, UserRole, LoyaltyAccount } from '@/utils/types';
import { getStore, insertOne, setStore } from '@/utils/storage';

interface RegisterDto {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol: UserRole;
}

export async function registerService(dto: RegisterDto): Promise<User> {
  const users = getStore<User>('cleanly_users');

  // Email único
  if (users.some((u) => u.email === dto.email)) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Este correo ya está registrado');
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    email: dto.email,
    password: dto.password,
    nombre: dto.nombre,
    telefono: dto.telefono,
    rol: dto.rol,
    createdAt: new Date().toISOString(),
  };

  insertOne('cleanly_users', newUser);

  // Si es trabajador, crear perfil básico
  if (dto.rol === 'worker') {
    const workerProfile = {
      id: `w-${Date.now()}`,
      userId: newUser.id,
      nombre: dto.nombre,
      email: dto.email,
      telefono: dto.telefono,
      bio: '',
      servicios: [],
      tarifaHora: 10.0,
      zona: '',
      verificationStatus: 'PENDIENTE' as const,
      avgRating: 0,
      totalReviews: 0,
      completedServices: 0,
      disponibilidad: [],
      createdAt: new Date().toISOString(),
    };
    insertOne('cleanly_workers', workerProfile as any);
  }

  // Inicializar cuenta de lealtad para clientes
  if (dto.rol === 'client') {
    const loyaltyAccounts = getStore<LoyaltyAccount>('cleanly_loyalty');
    const newAccount: LoyaltyAccount = {
      id: `la-${Date.now()}`,
      clientId: newUser.id,
      totalServicios: 0,
      puntos: 0,
      cupones: [],
    };
    loyaltyAccounts.push(newAccount);
    setStore('cleanly_loyalty', loyaltyAccounts);
  }

  await new Promise((r) => setTimeout(r, 500));
  return { ...newUser, password: '' };
}
