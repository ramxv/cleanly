<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">Verificación de Trabajadores</h1>
          <p class="page__subtitle">Aprueba o rechaza trabajadores pendientes</p>
        </div>

        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando trabajadores pendientes...</p>
        </div>

        <div v-else class="workers">
          <div
            v-for="worker in pendingWorkers"
            :key="worker.id"
            class="worker-card"
          >
            <div class="worker-card__avatar">
              {{ worker.nombre.charAt(0) }}
            </div>
            <div class="worker-card__info">
              <h3 class="worker-card__name">{{ worker.nombre }}</h3>
              <p class="worker-card__email">{{ worker.email }}</p>
              <p class="worker-card__phone">{{ worker.telefono }}</p>
              <p class="worker-card__services" v-if="worker.servicios.length">
                {{ worker.servicios.join(', ') }}
              </p>
              <q-badge color="warning" label="Pendiente aprobación" />
            </div>
            <div class="worker-card__actions">
              <q-btn
                unelevated
                no-caps
                color="positive"
                label="Aprobar"
                icon="check"
                :loading="approvingId === worker.id"
                @click="approveWorker(worker.id)"
              />
              <q-btn
                outline
                no-caps
                color="negative"
                label="Rechazar"
                icon="close"
                :loading="rejectingId === worker.id"
                @click="rejectWorker(worker.id)"
              />
            </div>
          </div>

          <div v-if="pendingWorkers.length === 0" class="page__empty">
            <span class="page__empty-icon">✅</span>
            <h3>Todo al día</h3>
            <p>No hay trabajadores pendientes de verificación.</p>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useAdmin } from '../composables/useAdmin';
import { useToast } from '@/composables/useToast';

const { pendingWorkers, isLoading, loadPendingWorkers, verifyWorker, rejectWorker: rejectWorkerAction } = useAdmin();
const { success, error } = useToast();

const approvingId = ref<string | null>(null);
const rejectingId = ref<string | null>(null);

onMounted(() => loadPendingWorkers());

async function approveWorker(id: string) {
  approvingId.value = id;
  try {
    await verifyWorker(id);
    success('Trabajador aprobado correctamente');
  } catch (e: any) {
    error(e.message || 'Error al aprobar');
  } finally {
    approvingId.value = null;
  }
}

async function rejectWorker(id: string) {
  rejectingId.value = id;
  try {
    await rejectWorkerAction(id);
    success('Trabajador rechazado');
  } catch (e: any) {
    error(e.message || 'Error al rechazar');
  } finally {
    rejectingId.value = null;
  }
}
</script>

<style scoped>
.page {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-warm);
  min-height: calc(100vh - var(--nav-height));
}
.page__header {
  margin-bottom: var(--space-6);
}
.page__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin-bottom: var(--space-1);
}
.page__subtitle {
  color: var(--color-text-secondary);
}
.page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-20) 0;
  color: var(--color-text-secondary);
}

.workers {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.worker-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.worker-card__avatar {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-full);
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  flex-shrink: 0;
}

.worker-card__info {
  flex: 1;
  min-width: 0;
}
.worker-card__name {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0 0 2px;
}
.worker-card__email,
.worker-card__phone {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}
.worker-card__services {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin: var(--space-1) 0;
}

.worker-card__actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.page__empty {
  text-align: center;
  padding: var(--space-20) 0;
  color: var(--color-text-secondary);
}
.page__empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-4);
}
.page__empty h3 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-2);
  color: var(--color-text);
}
</style>
