// ============================================================
// Cleanly - Workers: Simular subida de documentos
// Actualiza verificationStatus a PENDIENTE para re-verificación
// ============================================================

import type { WorkerProfile } from '@/utils/types';
import { updateOne, getOne, delay } from '@/utils/storage';

export async function uploadDocuments(
  workerId: string,
  _files: File[],
): Promise<WorkerProfile> {
  const worker = getOne<WorkerProfile>('cleanly_workers', workerId);

  if (!worker) {
    return delay(null as never).then(() => {
      throw new Error('Trabajador no encontrado');
    });
  }

  // Simula subida: pone al trabajador en PENDIENTE para re-verificación
  const updated = updateOne<WorkerProfile>('cleanly_workers', workerId, {
    verificationStatus: 'PENDIENTE',
  });

  return delay(updated!);
}
