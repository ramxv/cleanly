<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <q-btn flat round icon="arrow_back" @click="$router.push('/service-requests/new')" />
          <div>
            <h1 class="page__title">Trabajadores disponibles</h1>
            <p class="page__subtitle" v-if="currentRequest">
              {{ currentRequest.servicio }} en {{ currentRequest.zona }} —
              {{ formatDate(currentRequest.fecha) }}
            </p>
          </div>
        </div>

        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Buscando los mejores matches...</p>
        </div>

        <div v-else-if="matches.length === 0" class="page__empty">
          <span class="page__empty-icon">😔</span>
          <h3>No se encontraron trabajadores</h3>
          <p>Intenta ajustar tu búsqueda (otra zona, otra fecha).</p>
          <q-btn
            unelevated
            no-caps
            color="primary"
            to="/service-requests/new"
            label="Nueva búsqueda"
          />
        </div>

        <div v-else class="results">
          <p class="results__count">
            {{ matches.length }} trabajador(es) encontrado(s) —
            ordenados por calificación
          </p>

          <div
            v-for="(match, idx) in matches"
            :key="match.id"
            class="match-card"
          >
            <div class="match-card__rank">
              <span class="match-card__rank-badge" v-if="idx === 0">🏆 Mejor match</span>
              <span class="match-card__rank-num">#{{ idx + 1 }}</span>
            </div>

            <div class="match-card__main">
              <div class="match-card__avatar">
                {{ match.nombre.charAt(0) }}
              </div>
              <div class="match-card__info">
                <h3 class="match-card__name">{{ match.nombre }}</h3>
                <div class="match-card__rating">
                  <span class="match-card__stars">⭐ {{ match.avgRating.toFixed(1) }}</span>
                  <span class="match-card__reviews">
                    {{ match.totalReviews }} reseñas · {{ match.completedServices }} servicios
                  </span>
                </div>
                <p class="match-card__bio">{{ match.bio }}</p>
                <div class="match-card__tags">
                  <q-badge v-for="s in match.servicios" :key="s" outline color="primary" :label="s" />
                </div>
              </div>
              <div class="match-card__price">
                <span class="match-card__rate">B/. {{ match.tarifaHora.toFixed(2) }}/h</span>
                <span class="match-card__total">
                  {{ currentRequest?.horas ?? 0 }}h = B/. {{ (match.tarifaHora * (currentRequest?.horas ?? 0)).toFixed(2) }}
                </span>
              </div>
            </div>

            <div class="match-card__actions">
              <q-btn
                unelevated
                no-caps
                color="primary"
                label="Reservar"
                :loading="bookingId === match.id"
                @click="handleBook(match)"
              />
              <q-btn
                flat
                no-caps
                color="primary"
                label="Ver perfil"
                :to="`/workers/${match.id}`"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useServiceRequests } from '../composables/useServiceRequests';
import { useBookings } from '@/features/bookings/composables/useBookings';
import { useToast } from '@/composables/useToast';
import { formatDate } from '@/utils/formatters';
import type { WorkerProfile } from '@/utils/types';

const router = useRouter();
const { matches, currentRequest, isLoading } = useServiceRequests();
const { createBooking } = useBookings();
const { success, error } = useToast();

const bookingId = ref<string | null>(null);

onMounted(() => {
  // Si no hay matches, redirigir a la búsqueda
  if (!currentRequest.value && !isLoading.value) {
    router.replace('/service-requests/new');
  }
});

async function handleBook(worker: WorkerProfile) {
  bookingId.value = worker.id;
  try {
    if (!currentRequest.value) {
      throw new Error('No hay solicitud activa');
    }
    const booking = await createBooking({
      workerId: worker.id,
      workerName: worker.nombre,
      servicio: currentRequest.value.servicio,
      zona: currentRequest.value.zona,
      fecha: currentRequest.value.fecha,
      horas: currentRequest.value.horas,
      precioHora: worker.tarifaHora,
    });
    success('¡Reserva creada! Redirigiendo...');
    setTimeout(() => {
      router.push(`/bookings/${booking.id}`);
    }, 1000);
  } catch (e: any) {
    error(e.message || 'Error al crear reserva');
  } finally {
    bookingId.value = null;
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
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.page__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0;
}
.page__subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
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

.results__count {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.match-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
}
.match-card__rank {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.match-card__rank-badge {
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
  border-radius: var(--radius-full);
  padding: 2px 12px;
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
.match-card__rank-num {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--weight-semibold);
}

.match-card__main {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}
.match-card__avatar {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-full);
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  flex-shrink: 0;
}
.match-card__info {
  flex: 1;
  min-width: 0;
}
.match-card__name {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0 0 2px;
}
.match-card__rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  margin-bottom: var(--space-1);
}
.match-card__stars {
  color: var(--color-accent);
  font-weight: var(--weight-semibold);
}
.match-card__reviews {
  color: var(--color-text-tertiary);
}
.match-card__bio {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.match-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.match-card__price {
  text-align: right;
  flex-shrink: 0;
}
.match-card__rate {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-primary);
}
.match-card__total {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.match-card__actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}
</style>
