import type { WorkerProfile } from '@/utils/types';
import { updateOne, delay } from '@/utils/storage';

/**
 * Aprueba o rechaza a un trabajador pendiente de verificación.
 *
 * @param workerId  ID del WorkerProfile a modificar
 * @param approved  true → APROBADO, false → RECHAZADO
 * @returns         El WorkerProfile actualizado
 * @throws          Error si el trabajador no existe
 */
export async function verifyWorker(
  workerId: string,
  approved: boolean,
): Promise<WorkerProfile> {
  const updated = updateOne<WorkerProfile>('cleanly_workers', workerId, {
    verificationStatus: approved ? 'APROBADO' : 'RECHAZADO',
  });

  if (!updated) {
    return delay(null as never).then(() => {
      throw new Error('Trabajador no encontrado');
    });
  }

  return delay(updated);
}
