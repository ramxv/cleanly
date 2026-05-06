import { ref } from 'vue';
import type { AdminMetrics, WorkerProfile } from '@/utils/types';
import { getStore, delay } from '@/utils/storage';

/**
 * Composable de administración — expone métricas del dashboard,
 * lista de trabajadores pendientes de verificación y acciones
 * para aprobar o rechazar trabajadores.
 */
export function useAdmin() {
  const metrics = ref<AdminMetrics | null>(null);
  const pendingWorkers = ref<WorkerProfile[]>([]);
  const isLoading = ref(false);

  /**
   * Carga las métricas del sistema desde el service getMetrics.
   */
  async function loadMetrics(): Promise<void> {
    isLoading.value = true;
    const { getMetrics: getMetricsService } = await import(
      '@/features/admin/services/getMetrics'
    );
    metrics.value = await getMetricsService();
    isLoading.value = false;
  }

  /**
   * Carga la lista de trabajadores con estado PENDIENTE.
   */
  async function loadPendingWorkers(): Promise<void> {
    isLoading.value = true;
    const workers = getStore<WorkerProfile>('cleanly_workers');
    pendingWorkers.value = workers.filter(
      (w) => w.verificationStatus === 'PENDIENTE',
    );
    await delay(null);
    isLoading.value = false;
  }

  /**
   * Aprueba a un trabajador (verificationStatus → APROBADO)
   * y lo remueve de la lista de pendientes.
   */
  async function verifyWorker(id: string): Promise<WorkerProfile> {
    isLoading.value = true;
    const { verifyWorker: verifyWorkerService } = await import(
      '@/features/admin/services/verifyWorker'
    );
    const updated = await verifyWorkerService(id, true);
    pendingWorkers.value = pendingWorkers.value.filter((w) => w.id !== id);
    isLoading.value = false;
    return updated;
  }

  /**
   * Rechaza a un trabajador (verificationStatus → RECHAZADO)
   * y lo remueve de la lista de pendientes.
   */
  async function rejectWorker(id: string): Promise<WorkerProfile> {
    isLoading.value = true;
    const { verifyWorker: verifyWorkerService } = await import(
      '@/features/admin/services/verifyWorker'
    );
    const updated = await verifyWorkerService(id, false);
    pendingWorkers.value = pendingWorkers.value.filter((w) => w.id !== id);
    isLoading.value = false;
    return updated;
  }

  return {
    metrics,
    pendingWorkers,
    isLoading,
    loadMetrics,
    loadPendingWorkers,
    verifyWorker,
    rejectWorker,
  };
}
