import type { AdminMetrics, User, WorkerProfile, Booking } from '@/utils/types';
import { getStore, delay } from '@/utils/storage';

/**
 * Calcula las métricas del dashboard de administración.
 * Lee todas las colecciones del localStorage y agrega:
 * - totalUsuarios: cantidad de usuarios registrados
 * - totalTrabajadores: cantidad de perfiles de trabajador
 * - totalReservas: cantidad de bookings
 * - ingresosPlataforma: suma de comisiones (15% de cada reserva)
 * - trabajadoresPendientes: trabajadores con verificationStatus PENDIENTE
 * - reservasHoy: reservas cuya fecha == hoy
 */
export async function getMetrics(): Promise<AdminMetrics> {
  const users = getStore<User>('cleanly_users');
  const workers = getStore<WorkerProfile>('cleanly_workers');
  const bookings = getStore<Booking>('cleanly_bookings');

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const metrics: AdminMetrics = {
    totalUsuarios: users.length,
    totalTrabajadores: workers.length,
    totalReservas: bookings.length,
    ingresosPlataforma: bookings.reduce((sum, b) => sum + b.comision, 0),
    trabajadoresPendientes: workers.filter(
      (w) => w.verificationStatus === 'PENDIENTE',
    ).length,
    reservasHoy: bookings.filter((b) => b.fecha.slice(0, 10) === today).length,
  };

  return delay(metrics);
}
