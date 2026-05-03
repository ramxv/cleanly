import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/features/landing/views/LandingView.vue'),
  },
  {
    path: '/terminos',
    name: 'terms',
    component: () => import('@/features/landing/views/LegalView.vue'),
    props: { initial: 'terms' },
  },
  {
    path: '/privacidad',
    name: 'privacy',
    component: () => import('@/features/landing/views/LegalView.vue'),
    props: { initial: 'privacy' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
  },
  {
    path: '/registro',
    name: 'register',
    component: () => import('@/features/auth/views/RegisterView.vue'),
  },
];
