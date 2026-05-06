// ============================================================
// Cleanly - Crear una nueva reserva
// Calcula precioTotal, comisión del 15% y simula pago automático
// ============================================================

import type { Booking, Payment, WorkerProfile } from '@/utils/types';
import { getStore, insertOne, delay } from '@/utils/storage';
import { COMISION_PLATAFORMA } from '@/utils/constants';

interface CreateBookingDto {
  clientId: string;
  workerId: string;
  servicio: string;
  zona: string;
  fecha: string;
  horas: number;
  direccion?: string;
}

export async function createBooking(dto: CreateBookingDto): Promise<Booking> {
  // Buscar el trabajador para obtener tarifaHora y nombre
  const workers = getStore<WorkerProfile>('cleanly_workers');
  const worker = workers.find((w) => w.id === dto.workerId);

  if (!worker) {
    throw new Error('Trabajador no encontrado');
  }

  const precioTotal = dto.horas * worker.tarifaHora;
  const comision = precioTotal * COMISION_PLATAFORMA;

  const booking: Booking = {
    id: `b-${Date.now()}`,
    clientId: dto.clientId,
    workerId: dto.workerId,
    workerName: worker.nombre,
    servicio: dto.servicio,
    zona: dto.zona,
    fecha: dto.fecha,
    horas: dto.horas,
    precioTotal,
    precioHora: worker.tarifaHora,
    comision,
    direccion: dto.direccion,
    status: 'PENDIENTE_PAGO',
    paymentStatus: 'PENDIENTE',
    createdAt: new Date().toISOString(),
  };

  insertOne('cleanly_bookings', booking);

  // Simular pago automático (MVP): crear el registro de pago
  const payment: Payment = {
    id: `p-${Date.now()}`,
    bookingId: booking.id,
    clientId: dto.clientId,
    workerId: dto.workerId,
    montoTotal: precioTotal,
    comision,
    montoNeto: precioTotal - comision,
    status: 'PENDIENTE',
    createdAt: new Date().toISOString(),
  };

  insertOne('cleanly_payments', payment);

  return delay(booking);
}
