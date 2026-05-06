// ============================================================
// Cleanly - Datos semilla para el MVP
// Se ejecuta al iniciar la app si no hay datos en localStorage
// ============================================================

import type {
  User,
  WorkerProfile,
  Booking,
  Payment,
  Review,
  LoyaltyAccount,
} from './types';
import { setStore } from './storage';

export function runSeed(): void {
  // Solo ejecutar si no hay datos
  if (localStorage.getItem('cleanly_seeded')) return;

  console.log('🌱 Ejecutando seed de Cleanly...');

  // ---- Usuarios ----
  const users: User[] = [
    {
      id: 'u-1',
      email: 'admin@cleanly.com',
      password: 'Admin123',
      nombre: 'Admin Cleanly',
      telefono: '+507 6000-0001',
      rol: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-2',
      email: 'cliente@email.com',
      password: 'Cliente123',
      nombre: 'María González',
      telefono: '+507 6000-0002',
      rol: 'client',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-3',
      email: 'ana@email.com',
      password: 'Trabajador123',
      nombre: 'Ana Martínez',
      telefono: '+507 6000-0003',
      rol: 'worker',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-4',
      email: 'carlos@email.com',
      password: 'Trabajador123',
      nombre: 'Carlos Ruiz',
      telefono: '+507 6000-0004',
      rol: 'worker',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-5',
      email: 'lucia@email.com',
      password: 'Trabajador123',
      nombre: 'Lucía Fernández',
      telefono: '+507 6000-0005',
      rol: 'worker',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-6',
      email: 'pedro@email.com',
      password: 'Trabajador123',
      nombre: 'Pedro Sánchez',
      telefono: '+507 6000-0006',
      rol: 'worker',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-7',
      email: 'marta@email.com',
      password: 'Trabajador123',
      nombre: 'Marta Díaz',
      telefono: '+507 6000-0007',
      rol: 'worker',
      createdAt: new Date().toISOString(),
    },
  ];

  // ---- Trabajadores ----
  const workers: WorkerProfile[] = [
    {
      id: 'w-1',
      userId: 'u-3',
      nombre: 'Ana Martínez',
      email: 'ana@email.com',
      telefono: '+507 6000-0003',
      bio: 'Especialista en limpieza profunda con 5 años de experiencia. Uso productos ecológicos.',
      servicios: ['Limpieza Profunda', 'Limpieza Regular', 'Limpieza Post-Obra'],
      tarifaHora: 12.5,
      zona: 'Casco Viejo',
      verificationStatus: 'APROBADO',
      avgRating: 4.8,
      totalReviews: 24,
      completedServices: 32,
      disponibilidad: [
        { dayOfWeek: 1, turno: 'manana' },
        { dayOfWeek: 1, turno: 'tarde' },
        { dayOfWeek: 2, turno: 'manana' },
        { dayOfWeek: 3, turno: 'manana' },
        { dayOfWeek: 3, turno: 'tarde' },
        { dayOfWeek: 4, turno: 'tarde' },
        { dayOfWeek: 5, turno: 'manana' },
        { dayOfWeek: 5, turno: 'tarde' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-2',
      userId: 'u-4',
      nombre: 'Carlos Ruiz',
      email: 'carlos@email.com',
      telefono: '+507 6000-0004',
      bio: 'Limpieza comercial y residencial. Puntual y responsable.',
      servicios: ['Limpieza Regular', 'Limpieza de Oficinas'],
      tarifaHora: 10.0,
      zona: 'Costa del Este',
      verificationStatus: 'APROBADO',
      avgRating: 4.5,
      totalReviews: 18,
      completedServices: 25,
      disponibilidad: [
        { dayOfWeek: 1, turno: 'manana' },
        { dayOfWeek: 2, turno: 'manana' },
        { dayOfWeek: 2, turno: 'tarde' },
        { dayOfWeek: 4, turno: 'manana' },
        { dayOfWeek: 4, turno: 'tarde' },
        { dayOfWeek: 5, turno: 'manana' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-3',
      userId: 'u-5',
      nombre: 'Lucía Fernández',
      email: 'lucia@email.com',
      telefono: '+507 6000-0005',
      bio: 'Especializada en limpieza post-obra y organización del hogar.',
      servicios: ['Limpieza Post-Obra', 'Limpieza Profunda'],
      tarifaHora: 15.0,
      zona: 'San Francisco',
      verificationStatus: 'APROBADO',
      avgRating: 4.9,
      totalReviews: 31,
      completedServices: 40,
      disponibilidad: [
        { dayOfWeek: 1, turno: 'manana' },
        { dayOfWeek: 1, turno: 'tarde' },
        { dayOfWeek: 2, turno: 'tarde' },
        { dayOfWeek: 3, turno: 'manana' },
        { dayOfWeek: 3, turno: 'tarde' },
        { dayOfWeek: 5, turno: 'manana' },
        { dayOfWeek: 5, turno: 'tarde' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-4',
      userId: 'u-6',
      nombre: 'Pedro Sánchez',
      email: 'pedro@email.com',
      telefono: '+507 6000-0006',
      bio: 'Servicio de limpieza regular y mudanzas. Vehículo propio.',
      servicios: ['Limpieza Regular', 'Limpieza de Oficinas'],
      tarifaHora: 11.0,
      zona: 'Bella Vista',
      verificationStatus: 'PENDIENTE',
      avgRating: 0,
      totalReviews: 0,
      completedServices: 0,
      disponibilidad: [
        { dayOfWeek: 2, turno: 'manana' },
        { dayOfWeek: 3, turno: 'manana' },
        { dayOfWeek: 4, turno: 'tarde' },
        { dayOfWeek: 5, turno: 'manana' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'w-5',
      userId: 'u-7',
      nombre: 'Marta Díaz',
      email: 'marta@email.com',
      telefono: '+507 6000-0007',
      bio: 'Ama de casa con experiencia en limpieza profunda y planchado.',
      servicios: ['Limpieza Profunda', 'Limpieza Regular'],
      tarifaHora: 9.5,
      zona: 'Punta Pacífica',
      verificationStatus: 'PENDIENTE',
      avgRating: 0,
      totalReviews: 0,
      completedServices: 0,
      disponibilidad: [
        { dayOfWeek: 1, turno: 'manana' },
        { dayOfWeek: 2, turno: 'manana' },
        { dayOfWeek: 2, turno: 'tarde' },
        { dayOfWeek: 3, turno: 'tarde' },
        { dayOfWeek: 5, turno: 'manana' },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  // ---- Reservas de ejemplo ----
  const bookings: Booking[] = [
    {
      id: 'b-1',
      clientId: 'u-2',
      workerId: 'w-1',
      workerName: 'Ana Martínez',
      servicio: 'Limpieza Profunda',
      zona: 'Casco Viejo',
      fecha: '2026-05-10T09:00:00',
      horas: 4,
      precioTotal: 50.0,
      precioHora: 12.5,
      comision: 7.5,
      direccion: 'Calle 5ta, Edificio Las Palmas, Apto 4B',
      status: 'COMPLETADA',
      paymentStatus: 'LIBERADO',
      createdAt: '2026-05-01T10:00:00',
    },
    {
      id: 'b-2',
      clientId: 'u-2',
      workerId: 'w-2',
      workerName: 'Carlos Ruiz',
      servicio: 'Limpieza Regular',
      zona: 'Costa del Este',
      fecha: '2026-05-08T14:00:00',
      horas: 3,
      precioTotal: 30.0,
      precioHora: 10.0,
      comision: 4.5,
      direccion: 'Avenida Balboa, Torre Platinum, Piso 12',
      status: 'CONFIRMADA',
      paymentStatus: 'COMPLETADO',
      createdAt: '2026-05-02T16:00:00',
    },
  ];

  // ---- Pagos ----
  const payments: Payment[] = [
    {
      id: 'p-1',
      bookingId: 'b-1',
      clientId: 'u-2',
      workerId: 'w-1',
      montoTotal: 50.0,
      comision: 7.5,
      montoNeto: 42.5,
      status: 'LIBERADO',
      createdAt: '2026-05-01T10:05:00',
    },
    {
      id: 'p-2',
      bookingId: 'b-2',
      clientId: 'u-2',
      workerId: 'w-2',
      montoTotal: 30.0,
      comision: 4.5,
      montoNeto: 25.5,
      status: 'COMPLETADO',
      createdAt: '2026-05-02T16:05:00',
    },
  ];

  // ---- Reseñas ----
  const reviews: Review[] = [
    {
      id: 'r-1',
      bookingId: 'b-1',
      clientId: 'u-2',
      workerId: 'w-1',
      rating: 5,
      comentario: 'Excelente servicio. Ana fue muy profesional y detallista. Mi casa quedó impecable.',
      createdAt: '2026-05-10T13:00:00',
    },
  ];

  // ---- Lealtad ----
  const loyalty: LoyaltyAccount[] = [
    {
      id: 'la-1',
      clientId: 'u-2',
      totalServicios: 2,
      puntos: 200,
      cupones: [],
    },
  ];

  // Persistir todo
  setStore('cleanly_users', users);
  setStore('cleanly_workers', workers);
  setStore('cleanly_bookings', bookings);
  setStore('cleanly_payments', payments);
  setStore('cleanly_reviews', reviews);
  setStore('cleanly_loyalty', loyalty);

  localStorage.setItem('cleanly_seeded', 'true');
  console.log('✅ Seed completado:', {
    users: users.length,
    workers: workers.length,
    bookings: bookings.length,
    payments: payments.length,
    reviews: reviews.length,
  });
}
