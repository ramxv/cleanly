<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">Mis Reservas</h1>
          <q-btn
            v-if="isClient"
            unelevated
            no-caps
            color="primary"
            icon="add"
            label="Nueva búsqueda"
            to="/service-requests/new"
          />
        </div>

        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando reservas...</p>
        </div>

        <div v-else-if="bookings.length === 0" class="page__empty">
          <span class="page__empty-icon">📋</span>
          <h3>Sin reservas aún</h3>
          <p v-if="isClient">
            Busca trabajadores y haz tu primera reserva.
          </p>
          <q-btn
            v-if="isClient"
            unelevated
            no-caps
            color="primary"
            to="/service-requests/new"
            label="Buscar trabajadores"
          />
        </div>

        <div v-else class="bookings">
          <div
            v-for="booking in bookings"
            :key="booking.id"
            class="booking-card"
            @click="$router.push(`/bookings/${booking.id}`)"
          >
            <div class="booking-card__status">
              <q-badge
                :color="statusColor(booking.status)"
                :label="statusLabel(booking.status)"
              />
            </div>
            <div class="booking-card__body">
              <h3 class="booking-card__worker">{{ booking.workerName }}</h3>
              <p class="booking-card__service">{{ booking.servicio }}</p>
              <div class="booking-card__meta">
                <span>📅 {{ formatDate(booking.fecha) }}</span>
                <span>⏱ {{ booking.horas }}h</span>
                <span>📍 {{ booking.zona }}</span>
              </div>
            </div>
            <div class="booking-card__price">
              <span class="booking-card__amount">B/. {{ booking.precioTotal.toFixed(2) }}</span>
              <q-icon name="chevron_right" color="grey-5" size="20px" />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useBookings } from '../composables/useBookings';
import { useAuth } from '@/composables/useAuth';
import { formatDate } from '@/utils/formatters';
import type { BookingStatus } from '@/utils/types';

const { userId, isClient } = useAuth();
const { bookings, isLoading, loadBookings } = useBookings();

onMounted(() => {
  if (userId.value) loadBookings(userId.value);
});

function statusColor(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    PENDIENTE_PAGO: 'warning',
    CONFIRMADA: 'info',
    EN_PROGRESO: 'purple',
    COMPLETADA: 'positive',
    CANCELADA: 'negative',
  };
  return colors[status] || 'grey';
}

function statusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    PENDIENTE_PAGO: 'Pendiente pago',
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
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-warm);
  min-height: calc(100vh - var(--nav-height));
}
.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.bookings {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.booking-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: box-shadow var(--duration-fast);
}
.booking-card:hover {
  box-shadow: var(--shadow-md);
}
.booking-card__status {
  flex-shrink: 0;
}
.booking-card__body {
  flex: 1;
  min-width: 0;
}
.booking-card__worker {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0 0 2px;
}
.booking-card__service {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
}
.booking-card__meta {
  display: flex;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.booking-card__price {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.booking-card__amount {
  font-family: var(--font-mono);
  font-weight: var(--weight-bold);
  color: var(--color-primary);
  font-size: var(--text-base);
}
</style>
