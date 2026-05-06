// ============================================================
// Cleanly - Service Requests: Crear solicitud y buscar matches
// Valida 24h de anticipación, busca trabajadores aprobados
// con matching de zona, servicio y disponibilidad.
// ============================================================

import type { ServiceRequest, WorkerProfile } from '@/utils/types';
import { getStore, insertOne, delay } from '@/utils/storage';
import { isAtLeast24hAhead } from '@/utils/validators';

export interface CreateRequestDto {
  clientId: string;
  servicio: string;
  zona: string;
  fecha: string;
  horas: number;
  tamanoPropiedad: string;
  notas?: string;
}

export interface CreateRequestResult {
  request: ServiceRequest;
  matches: WorkerProfile[];
}

export async function createServiceRequest(
  dto: CreateRequestDto,
): Promise<CreateRequestResult> {
  // Regla de negocio: mínimo 24h de anticipación
  if (!isAtLeast24hAhead(dto.fecha)) {
    return delay(null as never).then(() => {
      throw new Error(
        'El servicio debe programarse con al menos 24 horas de anticipación',
      );
    });
  }

  // Construir el ServiceRequest
  const request: ServiceRequest = {
    id: `sr-${Date.now()}`,
    clientId: dto.clientId,
    servicio: dto.servicio,
    zona: dto.zona,
    fecha: dto.fecha,
    horas: dto.horas,
    tamanoPropiedad: dto.tamanoPropiedad,
    notas: dto.notas,
    createdAt: new Date().toISOString(),
  };

  // Persistir solicitud
  insertOne('cleanly_service_requests', request);

  // Matching: día de la semana a partir de la fecha
  const fechaDate = new Date(dto.fecha);
  const dayOfWeek = fechaDate.getDay(); // 0=Domingo, 1=Lunes, ...

  // Buscar trabajadores aprobados que hagan match
  const workers = getStore<WorkerProfile>('cleanly_workers');

  const matches = workers
    .filter((w) => {
      // Solo aprobados
      if (w.verificationStatus !== 'APROBADO') return false;
      // Misma zona
      if (w.zona !== dto.zona) return false;
      // Ofrece el servicio solicitado
      if (!w.servicios.includes(dto.servicio)) return false;
      // Disponible ese día de la semana
      if (
        !w.disponibilidad.some((slot) => slot.dayOfWeek === dayOfWeek)
      )
        return false;
      return true;
    })
    // Ordenar por mejor rating descendente
    .sort((a, b) => b.avgRating - a.avgRating);

  return delay({ request, matches });
}
