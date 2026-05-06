// ============================================================
// Cleanly - Workers: Composable de gestión de trabajadores
// Estado reactivo y acciones para listar y actualizar workers
// ============================================================

import { ref } from 'vue';
import type { WorkerProfile } from '@/utils/types';
import { getStore } from '@/utils/storage';
import { getAllWorkers } from '../services/getAll';
import { getWorkerById } from '../services/getById';
import { updateWorkerProfile } from '../services/updateProfile';

export function useWorkers() {
  const workers = ref<WorkerProfile[]>([]);
  const worker = ref<WorkerProfile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /** Carga todos los trabajadores APROBADOS en la lista pública */
  async function loadWorkers(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      workers.value = await getAllWorkers();
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Error al cargar trabajadores';
    } finally {
      isLoading.value = false;
    }
  }

  /** Carga un trabajador específico por ID y lo guarda en worker ref */
  async function loadWorkerById(id: string): Promise<WorkerProfile | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await getWorkerById(id);
      worker.value = result;
      return result;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Error al cargar trabajador';
      worker.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /** Carga el perfil del trabajador por userId (para onboarding) */
  async function loadWorkerByUserId(userId: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const allWorkers = getStore<WorkerProfile>('cleanly_workers');
      const found = allWorkers.find((w) => w.userId === userId) ?? null;
      worker.value = found;
      if (!found) throw new Error('Perfil de trabajador no encontrado');
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Error al cargar perfil';
      worker.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /** Actualiza el perfil de un trabajador y refresca el estado local */
  async function updateWorker(
    id: string,
    updates: Partial<WorkerProfile>,
  ): Promise<WorkerProfile | undefined> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await updateWorkerProfile(id, updates);

      // Sincronizar estado local
      const index = workers.value.findIndex((w) => w.id === id);
      if (index !== -1) {
        workers.value[index] = updated;
      }
      if (worker.value?.id === id) {
        worker.value = updated;
      }

      return updated;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Error al actualizar trabajador';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    workers,
    worker,
    isLoading,
    error,
    loadWorkers,
    loadWorkerById,
    loadWorkerByUserId,
    updateWorker,
  };
}
