// ============================================================
// Cleanly - Service Requests: Composable de búsqueda de trabajadores
// Estado reactivo y acción para buscar matches de servicio
// ============================================================

import { ref } from 'vue';
import type { WorkerProfile, ServiceRequest } from '@/utils/types';
import { useAuth } from '@/composables/useAuth';
import {
  createServiceRequest,
  type CreateRequestDto,
} from '../services/create';
import { isAtLeast24hAhead } from '@/utils/validators';

export interface SearchWorkersDto {
  servicio: string;
  zona: string;
  fecha: string;
  horas: number;
  tamanoPropiedad: string;
  notas?: string;
}

export function useServiceRequests() {
  const matches = ref<WorkerProfile[]>([]);
  const currentRequest = ref<ServiceRequest | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { userId } = useAuth();

  /**
   * Busca trabajadores disponibles para un servicio.
   * Crea la solicitud y ejecuta el algoritmo de matching.
   * Regla: el servicio debe ser al menos 24h en el futuro.
   */
  async function searchWorkers(dto: SearchWorkersDto): Promise<void> {
    // Validación temprana de la regla de 24h
    if (!isAtLeast24hAhead(dto.fecha)) {
      error.value =
        'El servicio debe programarse con al menos 24 horas de anticipación';
      throw new Error(error.value);
    }

    isLoading.value = true;
    error.value = null;

    try {
      const fullDto: CreateRequestDto = {
        clientId: userId.value!,
        ...dto,
      };
      const result = await createServiceRequest(fullDto);
      currentRequest.value = result.request;
      matches.value = result.matches;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Error al buscar trabajadores';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    matches,
    currentRequest,
    isLoading,
    error,
    searchWorkers,
  };
}
