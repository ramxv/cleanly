// ============================================================
// Cleanly - Workers: Obtener trabajador por ID
// ============================================================

import type { WorkerProfile } from '@/utils/types';
import { getOne, delay } from '@/utils/storage';

export async function getWorkerById(id: string): Promise<WorkerProfile> {
  const worker = getOne<WorkerProfile>('cleanly_workers', id);

  if (!worker) {
    return delay(null as never).then(() => {
      throw new Error('Trabajador no encontrado');
    });
  }

  return delay(worker);
}
