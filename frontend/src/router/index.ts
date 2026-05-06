import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import type { User, UserRole } from '@/utils/types';
import { getOne } from '@/utils/storage';

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 64 };
    return { top: 0 };
  },
});

function getPayloadFromToken(): { sub: string; email: string; rol: UserRole } | null {
  const token = localStorage.getItem('cleanly_token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

function getUser(): User | null {
  const payload = getPayloadFromToken();
  if (!payload) return null;
  return getOne<User>('cleanly_users', payload.sub) ?? null;
}

router.beforeEach((to, _from, next) => {
  const { requiresAuth, roles, guest } = to.meta as {
    requiresAuth?: boolean;
    roles?: UserRole[];
    guest?: boolean;
  };

  const user = getUser();
  const isAuthenticated = !!user;

  // Rutas de guest (login/register): si ya está autenticado, redirigir
  if (guest && isAuthenticated) {
    if (user!.rol === 'admin') return next('/admin/dashboard');
    if (user!.rol === 'worker') return next('/workers');
    return next('/bookings');
  }

  // Rutas protegidas: si no está autenticado, redirigir a login
  if (requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  // Verificar roles
  if (requiresAuth && roles && isAuthenticated) {
    if (!roles.includes(user!.rol)) {
      return next('/');
    }
  }

  next();
});
