// ============================================================
// Cleanly - Historial de pagos de un cliente
// ============================================================

import type { Payment } from '@/utils/types';
import { query, delay } from '@/utils/storage';

export async function getPaymentHistory(clientId: string): Promise<Payment[]> {
  const payments = query<Payment>(
    'cleanly_payments',
    (p) => p.clientId === clientId,
  );
  return delay(payments);
}
