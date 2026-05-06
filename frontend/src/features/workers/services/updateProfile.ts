// ============================================================
// Cleanly - Workers: Actualizar perfil de trabajador
// ============================================================

import type { WorkerProfile } from '@/utils/types';
import { updateOne, delay } from '@/utils/storage';

export async function updateWorkerProfile(
  id: string,
  updates: Partial<WorkerProfile>,
): Promise<WorkerProfile> {
  const updated = updateOne<WorkerProfile>('cleanly_workers', id, updates);

  if (!updated) {
    return delay(null as never).then(() => {
      throw new Error('Trabajador no encontrado');
    });
  }

  return delay(updated);
}
