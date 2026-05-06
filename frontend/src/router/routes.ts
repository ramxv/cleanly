import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  // ---- PÚBLICAS ----
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
    meta: { guest: true },
  },
  {
    path: '/registro',
    name: 'register',
    component: () => import('@/features/auth/views/RegisterView.vue'),
    meta: { guest: true },
  },

  // ---- CLIENTE ----
  {
    path: '/service-requests/new',
    name: 'create-request',
    component: () => import('@/features/service-requests/views/CreateRequestView.vue'),
    meta: { requiresAuth: true, roles: ['client'] },
  },
  {
    path: '/service-requests/results',
    name: 'request-results',
    component: () => import('@/features/service-requests/views/RequestResultsView.vue'),
    meta: { requiresAuth: true, roles: ['client'] },
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: () => import('@/features/bookings/views/BookingListView.vue'),
    meta: { requiresAuth: true, roles: ['client', 'worker'] },
  },
  {
    path: '/bookings/:id',
    name: 'booking-detail',
    component: () => import('@/features/bookings/views/BookingDetailView.vue'),
    meta: { requiresAuth: true, roles: ['client', 'worker'] },
  },
  {
    path: '/payments',
    name: 'payments',
    component: () => import('@/features/payments/views/PaymentHistoryView.vue'),
    meta: { requiresAuth: true, roles: ['client'] },
  },
  {
    path: '/loyalty',
    name: 'loyalty',
    component: () => import('@/features/loyalty/views/LoyaltyView.vue'),
    meta: { requiresAuth: true, roles: ['client'] },
  },

  // ---- TRABAJADOR ----
  {
    path: '/workers',
    name: 'workers',
    component: () => import('@/features/workers/views/WorkerListView.vue'),
    meta: { requiresAuth: true, roles: ['client', 'worker', 'admin'] },
  },
  {
    path: '/workers/:id',
    name: 'worker-detail',
    component: () => import('@/features/workers/views/WorkerDetailView.vue'),
    meta: { requiresAuth: true, roles: ['client', 'worker', 'admin'] },
  },
  {
    path: '/worker/onboarding',
    name: 'worker-onboarding',
    component: () => import('@/features/workers/views/WorkerOnboardingView.vue'),
    meta: { requiresAuth: true, roles: ['worker'] },
  },

  // ---- ADMIN ----
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/features/admin/views/AdminDashboardView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/workers',
    name: 'admin-verification',
    component: () => import('@/features/admin/views/WorkerVerificationView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },

  // ---- 404 ----
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/features/landing/views/NotFoundView.vue'),
  },
];
