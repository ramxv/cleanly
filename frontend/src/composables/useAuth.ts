// ============================================================
// Cleanly - Composable global de autenticación
// Estado compartido entre todos los componentes que lo usan
// ============================================================

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { User, UserRole } from '@/utils/types';
import { loginService } from '@/features/auth/services/login';
import { registerService } from '@/features/auth/services/register';
import { refreshTokenService } from '@/features/auth/services/refreshToken';
import { getOne } from '@/utils/storage';

// Estado GLOBAL - fuera de la función, compartido por todas las instancias
const currentUser = ref<User | null>(null);
const accessToken = ref<string | null>(localStorage.getItem('cleanly_token'));
const isInitialized = ref(false);

export function useAuth() {
  const router = useRouter();

  const isAuthenticated = computed(() => !!accessToken.value && !!currentUser.value);
  const isAdmin = computed(() => currentUser.value?.rol === 'admin');
  const isWorker = computed(() => currentUser.value?.rol === 'worker');
  const isClient = computed(() => currentUser.value?.rol === 'client');
  const userRole = computed<UserRole | null>(() => currentUser.value?.rol ?? null);
  const userId = computed(() => currentUser.value?.id ?? null);

  // Inicializar desde token guardado
  async function initFromStoredToken(): Promise<void> {
    if (isInitialized.value) return;
    isInitialized.value = true;

    const token = localStorage.getItem('cleanly_token');
    if (!token) return;

    try {
      const { user, token: newToken } = await refreshTokenService(token);
      currentUser.value = user;
      accessToken.value = newToken;
      localStorage.setItem('cleanly_token', newToken);
    } catch {
      // Token inválido, limpiar
      localStorage.removeItem('cleanly_token');
      accessToken.value = null;
      currentUser.value = null;
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const { user, token } = await loginService(email, password);
    currentUser.value = user;
    accessToken.value = token;
    localStorage.setItem('cleanly_token', token);

    // Redirigir según rol
    if (user.rol === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.rol === 'worker') {
      router.push('/workers');
    } else {
      router.push('/bookings');
    }
  }

  async function register(dto: {
    nombre: string;
    email: string;
    telefono: string;
    password: string;
    rol: UserRole;
  }): Promise<void> {
    await registerService(dto);
    // Después de registro, iniciar sesión automáticamente
    await login(dto.email, dto.password);
  }

  function logout(): void {
    currentUser.value = null;
    accessToken.value = null;
    localStorage.removeItem('cleanly_token');
    router.push('/login');
  }

  return {
    currentUser,
    accessToken,
    isAuthenticated,
    isAdmin,
    isWorker,
    isClient,
    userRole,
    userId,
    isInitialized,
    initFromStoredToken,
    login,
    register,
    logout,
  };
}
