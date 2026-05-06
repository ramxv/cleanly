<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">Panel de Administración</h1>
          <p class="page__subtitle">Resumen del sistema Cleanly</p>
        </div>

        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando métricas...</p>
        </div>

        <div v-else-if="metrics" class="dashboard">
          <!-- Métricas principales -->
          <div class="metrics">
            <div class="metric">
              <q-icon name="people" size="28px" color="primary" />
              <span class="metric__value">{{ metrics.totalUsuarios }}</span>
              <span class="metric__label">Usuarios</span>
            </div>
            <div class="metric">
              <q-icon name="engineering" size="28px" color="primary" />
              <span class="metric__value">{{ metrics.totalTrabajadores }}</span>
              <span class="metric__label">Trabajadores</span>
            </div>
            <div class="metric">
              <q-icon name="event" size="28px" color="primary" />
              <span class="metric__value">{{ metrics.totalReservas }}</span>
              <span class="metric__label">Reservas</span>
            </div>
            <div class="metric">
              <q-icon name="payments" size="28px" color="accent" />
              <span class="metric__value">B/. {{ metrics.ingresosPlataforma.toFixed(2) }}</span>
              <span class="metric__label">Ingresos plataforma</span>
            </div>
            <div class="metric">
              <q-icon name="pending" size="28px" color="warning" />
              <span class="metric__value">{{ metrics.trabajadoresPendientes }}</span>
              <span class="metric__label">Pendientes verificar</span>
            </div>
            <div class="metric">
              <q-icon name="today" size="28px" color="positive" />
              <span class="metric__value">{{ metrics.reservasHoy }}</span>
              <span class="metric__label">Reservas hoy</span>
            </div>
          </div>

          <!-- Acciones rápidas -->
          <div class="actions">
            <q-btn
              unelevated
              no-caps
              color="primary"
              icon="verified_user"
              label="Verificar trabajadores"
              to="/admin/workers"
            />
            <q-btn
              outline
              no-caps
              color="primary"
              icon="groups"
              label="Ver trabajadores activos"
              to="/workers"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useAdmin } from '../composables/useAdmin';

const { metrics, isLoading, loadMetrics } = useAdmin();

onMounted(() => loadMetrics());
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

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.metric {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
}
.metric__value {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
}
.metric__label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.actions {
  display: flex;
  gap: var(--space-3);
}
</style>
