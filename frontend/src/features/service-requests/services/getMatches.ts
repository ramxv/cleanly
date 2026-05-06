// ============================================================
// Cleanly - Service Requests: Obtener matches para una solicitud existente
// Re-ejecuta el algoritmo de matching sobre la solicitud guardada
// ============================================================

import type { ServiceRequest, WorkerProfile } from '@/utils/types';
import { getOne, getStore, delay } from '@/utils/storage';

export interface GetMatchesResult {
  request: ServiceRequest;
  matches: WorkerProfile[];
}

export async function getMatchesForRequest(
  requestId: string,
): Promise<GetMatchesResult> {
  const request = getOne<ServiceRequest>(
    'cleanly_service_requests',
    requestId,
  );

  if (!request) {
    return delay(null as never).then(() => {
      throw new Error('Solicitud no encontrada');
    });
  }

  // Re-calcular día de la semana
  const fechaDate = new Date(request.fecha);
  const dayOfWeek = fechaDate.getDay();

  // Re-ejecutar matching
  const workers = getStore<WorkerProfile>('cleanly_workers');

  const matches = workers
    .filter((w) => {
      if (w.verificationStatus !== 'APROBADO') return false;
      if (w.zona !== request.zona) return false;
      if (!w.servicios.includes(request.servicio)) return false;
      if (
        !w.disponibilidad.some((slot) => slot.dayOfWeek === dayOfWeek)
      )
        return false;
      return true;
    })
    .sort((a, b) => b.avgRating - a.avgRating);

  return delay({ request, matches });
}
