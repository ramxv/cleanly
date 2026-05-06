<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">Historial de Pagos</h1>
        </div>

        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando pagos...</p>
        </div>

        <div v-else-if="payments.length === 0" class="page__empty">
          <span class="page__empty-icon">💰</span>
          <h3>Sin pagos aún</h3>
          <p>Tu historial de pagos aparecerá aquí cuando reserves un servicio.</p>
        </div>

        <div v-else class="payments">
          <!-- Resumen -->
          <div class="summary-card">
            <div class="summary-card__item">
              <span class="summary-card__label">Total gastado</span>
              <span class="summary-card__value">B/. {{ totalGastado.toFixed(2) }}</span>
            </div>
            <div class="summary-card__item">
              <span class="summary-card__label">Comisiones (15%)</span>
              <span class="summary-card__value">B/. {{ totalComisiones.toFixed(2) }}</span>
            </div>
            <div class="summary-card__item">
              <span class="summary-card__label">Neto a trabajadores</span>
              <span class="summary-card__value">B/. {{ totalNeto.toFixed(2) }}</span>
            </div>
          </div>

          <div
            v-for="payment in payments"
            :key="payment.id"
            class="payment-card"
          >
            <div class="payment-card__header">
              <span class="payment-card__id">Pago #{{ payment.id }}</span>
              <q-badge
                :color="paymentStatusColor(payment.status)"
                :label="paymentStatusLabel(payment.status)"
              />
            </div>
            <div class="payment-card__body">
              <div class="payment-card__detail">
                <span>Total</span>
                <strong>B/. {{ payment.montoTotal.toFixed(2) }}</strong>
              </div>
              <div class="payment-card__detail">
                <span>Comisión (15%)</span>
                <span class="payment-card__commission">-B/. {{ payment.comision.toFixed(2) }}</span>
              </div>
              <div class="payment-card__detail payment-card__detail--neto">
                <span>Neto al trabajador</span>
                <strong class="payment-card__neto">B/. {{ payment.montoNeto.toFixed(2) }}</strong>
              </div>
            </div>
            <div class="payment-card__footer">
              <span>{{ formatDate(payment.createdAt) }}</span>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { usePayments } from '../composables/usePayments';
import { useAuth } from '@/composables/useAuth';
import { formatDate } from '@/utils/formatters';
import type { PaymentStatus } from '@/utils/types';

const { userId } = useAuth();
const { payments, isLoading, loadHistory } = usePayments();

onMounted(() => {
  if (userId.value) loadHistory(userId.value);
});

const totalGastado = computed(() =>
  payments.value.reduce((sum, p) => sum + p.montoTotal, 0),
);

const totalComisiones = computed(() =>
  payments.value.reduce((sum, p) => sum + p.comision, 0),
);

const totalNeto = computed(() =>
  payments.value.reduce((sum, p) => sum + p.montoNeto, 0),
);

function paymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    PENDIENTE: 'warning',
    COMPLETADO: 'info',
    LIBERADO: 'positive',
    REEMBOLSADO: 'negative',
  };
  return colors[status] || 'grey';
}

function paymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    PENDIENTE: 'Pendiente',
    COMPLETADO: 'Retenido',
    LIBERADO: 'Liberado',
    REEMBOLSADO: 'Reembolsado',
  };
  return labels[status];
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
  margin: 0;
}
.page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-20) 0;
  color: var(--color-text-secondary);
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

.summary-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}
.summary-card__item {
  flex: 1;
  min-width: 120px;
  text-align: center;
}
.summary-card__label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: 4px;
}
.summary-card__value {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text);
}

.payments {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.payment-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.payment-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-subtle);
  border-bottom: 1px solid var(--color-border);
}
.payment-card__id {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}
.payment-card__body {
  padding: var(--space-4);
}
.payment-card__detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-1) 0;
  font-size: var(--text-sm);
}
.payment-card__commission {
  color: var(--color-error);
}
.payment-card__detail--neto {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-2);
  padding-top: var(--space-2);
}
.payment-card__neto {
  color: var(--color-success-text);
  font-family: var(--font-mono);
}
.payment-card__footer {
  padding: var(--space-2) var(--space-4);
  border-top: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
</style>
