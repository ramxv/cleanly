// ============================================================
// Cleanly - Workers: Obtener todos los trabajadores aprobados
// ============================================================

import type { WorkerProfile } from '@/utils/types';
import { getStore, delay } from '@/utils/storage';

export async function getAllWorkers(): Promise<WorkerProfile[]> {
  const workers = getStore<WorkerProfile>('cleanly_workers');
  const approved = workers.filter(
    (w) => w.verificationStatus === 'APROBADO',
  );
  return delay(approved);
}
