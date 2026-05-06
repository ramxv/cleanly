<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando reserva...</p>
        </div>

        <div v-else-if="booking" class="detail">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click="$router.back()"
            class="detail__back"
          />

          <!-- Estado -->
          <div class="detail__status-banner" :class="`status--${booking.status}`">
            <span>{{ statusLabel(booking.status) }}</span>
          </div>

          <!-- Info del trabajador -->
          <div class="card">
            <div class="card__row">
              <div class="card__avatar">
                {{ booking.workerName.charAt(0) }}
              </div>
              <div>
                <h2 class="card__worker-name">{{ booking.workerName }}</h2>
                <p class="card__service">{{ booking.servicio }}</p>
              </div>
            </div>
          </div>

          <!-- Detalles -->
          <div class="card">
            <h3 class="card__section-title">Detalles del servicio</h3>
            <dl class="card__details">
              <div class="card__detail">
                <dt>Fecha</dt>
                <dd>{{ formatDate(booking.fecha) }} a las {{ formatTime(booking.fecha) }}</dd>
              </div>
              <div class="card__detail">
                <dt>Duración</dt>
                <dd>{{ booking.horas }} horas</dd>
              </div>
              <div class="card__detail">
                <dt>Zona</dt>
                <dd>{{ booking.zona }}</dd>
              </div>
              <div class="card__detail">
                <dt>Tarifa</dt>
                <dd>B/. {{ booking.precioHora.toFixed(2) }}/hora</dd>
              </div>
              <div class="card__detail card__detail--total">
                <dt>Total</dt>
                <dd class="card__price">B/. {{ booking.precioTotal.toFixed(2) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Dirección (solo si CONFIRMADA o posterior) -->
          <div v-if="showAddress && booking.direccion" class="card">
            <h3 class="card__section-title">📍 Dirección</h3>
            <p class="card__address">{{ booking.direccion }}</p>
          </div>

          <!-- Timeline de estados -->
          <div class="card">
            <h3 class="card__section-title">Progreso</h3>
            <div class="timeline">
              <div
                v-for="step in timelineSteps"
                :key="step.status"
                class="timeline__step"
                :class="{ 'timeline__step--active': step.active, 'timeline__step--done': step.done }"
              >
                <div class="timeline__dot" />
                <span class="timeline__label">{{ step.label }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="detail__actions">
            <!-- Cliente: Cancelar si PENDIENTE_PAGO o CONFIRMADA -->
            <q-btn
              v-if="isClient && canCancel"
              outline
              no-caps
              color="negative"
              label="Cancelar reserva"
              :loading="actionLoading"
              @click="handleCancel"
            />

            <!-- Trabajador: Avanzar estado -->
            <q-btn
              v-if="isWorker && nextStatus"
              unelevated
              no-caps
              color="primary"
              :label="nextStatusLabel"
              :loading="actionLoading"
              @click="handleAdvanceStatus"
            />

            <!-- Cliente: Dejar reseña si completada -->
            <q-btn
              v-if="isClient && booking.status === 'COMPLETADA'"
              unelevated
              no-caps
              color="accent"
              label="Dejar reseña"
              @click="showReviewDialog = true"
            />
          </div>

          <!-- Modal de reseña -->
          <ReviewModal
            v-if="showReviewDialog"
            :booking-id="booking.id"
            :worker-id="booking.workerId"
            @close="showReviewDialog = false"
            @submitted="onReviewSubmitted"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import ReviewModal from '@/features/reviews/views/ReviewModal.vue';
import { useBookings } from '../composables/useBookings';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { formatDate, formatTime } from '@/utils/formatters';
import type { BookingStatus } from '@/utils/types';

const route = useRoute();
const { userId, isClient, isWorker } = useAuth();
const { booking, isLoading, loadBooking, cancelBooking, updateBookingStatus } = useBookings();
const { success, error: showError } = useToast();

const actionLoading = ref(false);
const showReviewDialog = ref(false);

onMounted(() => {
  loadBooking(route.params.id as string);
});

const showAddress = computed(() => {
  if (!booking.value) return false;
  const visibleStatuses: BookingStatus[] = ['CONFIRMADA', 'EN_PROGRESO', 'COMPLETADA'];
  return visibleStatuses.includes(booking.value.status);
});

const canCancel = computed(() => {
  if (!booking.value) return false;
  return ['PENDIENTE_PAGO', 'CONFIRMADA'].includes(booking.value.status);
});

const statusOrder: BookingStatus[] = ['PENDIENTE_PAGO', 'CONFIRMADA', 'EN_PROGRESO', 'COMPLETADA'];

const timelineSteps = computed(() => {
  const currentIdx = statusOrder.indexOf(booking.value?.status ?? 'PENDIENTE_PAGO');
  return statusOrder.map((status, idx) => ({
    status,
    label: statusLabel(status),
    active: idx === currentIdx,
    done: idx < currentIdx,
  }));
});

const nextStatus = computed(() => {
  const currentIdx = statusOrder.indexOf(booking.value?.status ?? 'PENDIENTE_PAGO');
  if (currentIdx < statusOrder.length - 1) {
    return statusOrder[currentIdx + 1];
  }
  return null;
});

const nextStatusLabel = computed(() => {
  if (nextStatus.value === 'CONFIRMADA') return 'Confirmar reserva';
  if (nextStatus.value === 'EN_PROGRESO') return 'Iniciar servicio';
  if (nextStatus.value === 'COMPLETADA') return 'Marcar como completado';
  return 'Avanzar';
});

async function handleCancel() {
  actionLoading.value = true;
  try {
    await cancelBooking(booking.value!.id);
    success('Reserva cancelada');
  } catch (e: any) {
    showError(e.message || 'Error al cancelar');
  } finally {
    actionLoading.value = false;
  }
}

async function handleAdvanceStatus() {
  if (!nextStatus.value) return;
  actionLoading.value = true;
  try {
    await updateBookingStatus(booking.value!.id, nextStatus.value);
    success(`Reserva ${statusLabel(nextStatus.value).toLowerCase()}`);
  } catch (e: any) {
    showError(e.message || 'Error al actualizar');
  } finally {
    actionLoading.value = false;
  }
}

function onReviewSubmitted() {
  showReviewDialog.value = false;
}

function statusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    PENDIENTE_PAGO: 'Pendiente de pago',
    CONFIRMADA: 'Confirmada',
    EN_PROGRESO: 'En progreso',
    COMPLETADA: 'Completada',
    CANCELADA: 'Cancelada',
  };
  return labels[status];
}
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-warm);
  min-height: calc(100vh - var(--nav-height));
}
.page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-20) 0;
  color: var(--color-text-secondary);
}

.detail__back {
  margin-bottom: var(--space-4);
}

.detail__status-banner {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: var(--weight-bold);
  font-size: var(--text-md);
  text-align: center;
  margin-bottom: var(--space-4);
}
.status--PENDIENTE_PAGO { background: var(--color-warning-bg); color: var(--color-warning-text); }
.status--CONFIRMADA { background: #dbeafe; color: #1e40af; }
.status--EN_PROGRESO { background: #f3e8ff; color: #6b21a8; }
.status--COMPLETADA { background: var(--color-success-bg); color: var(--color-success-text); }
.status--CANCELADA { background: var(--color-error-bg); color: var(--color-error-text); }

.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}
.card__row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.card__avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
}
.card__worker-name {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  margin: 0 0 2px;
  color: var(--color-text);
}
.card__service {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}
.card__section-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin: 0 0 var(--space-3);
}
.card__details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.card__detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
}
.card__detail dt {
  color: var(--color-text-secondary);
}
.card__detail dd {
  font-weight: var(--weight-semibold);
  color: var(--color-text);
  margin: 0;
}
.card__detail--total {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-3);
  margin-top: var(--space-2);
}
.card__price {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-primary);
}
.card__address {
  color: var(--color-text);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

.timeline {
  display: flex;
  gap: var(--space-1);
}
.timeline__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: var(--space-2);
  opacity: 0.4;
}
.timeline__step--active {
  opacity: 1;
}
.timeline__step--done {
  opacity: 0.7;
}
.timeline__dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  border: 2px solid var(--color-border);
}
.timeline__step--active .timeline__dot {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.timeline__step--done .timeline__dot {
  background: var(--color-success);
  border-color: var(--color-success);
}
.timeline__label {
  font-size: 10px;
  color: var(--color-text-secondary);
  text-align: center;
  font-weight: var(--weight-medium);
}

.detail__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-6);
}
</style>
