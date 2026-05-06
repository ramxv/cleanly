// ============================================================
// Cleanly - Procesar un pago
// Crea el payment con montoTotal, comisión (15%) y montoNeto
// Estado inicial: PENDIENTE
// ============================================================

import type { Payment } from '@/utils/types';
import { insertOne, delay } from '@/utils/storage';
import { COMISION_PLATAFORMA } from '@/utils/constants';

interface ProcessPaymentDto {
  bookingId: string;
  clientId: string;
  workerId: string;
  montoTotal: number;
}

export async function processPayment(dto: ProcessPaymentDto): Promise<Payment> {
  const comision = dto.montoTotal * COMISION_PLATAFORMA;
  const montoNeto = dto.montoTotal - comision;

  const payment: Payment = {
    id: `p-${Date.now()}`,
    bookingId: dto.bookingId,
    clientId: dto.clientId,
    workerId: dto.workerId,
    montoTotal: dto.montoTotal,
    comision,
    montoNeto,
    status: 'PENDIENTE',
    createdAt: new Date().toISOString(),
  };

  insertOne('cleanly_payments', payment);
  return delay(payment);
}
