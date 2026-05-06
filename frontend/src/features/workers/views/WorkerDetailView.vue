<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando perfil...</p>
        </div>

        <div v-else-if="worker" class="profile">
          <!-- Header -->
          <div class="profile__header">
            <q-btn
              flat
              round
              icon="arrow_back"
              @click="$router.back()"
              class="profile__back"
            />
            <div class="profile__avatar-lg">
              {{ worker.nombre.charAt(0) }}
            </div>
            <div class="profile__header-info">
              <h1 class="profile__name">{{ worker.nombre }}</h1>
              <div class="profile__rating">
                <span class="profile__stars">⭐ {{ worker.avgRating.toFixed(1) }}</span>
                <span>({{ worker.totalReviews }} reseñas • {{ worker.completedServices }} servicios)</span>
              </div>
              <q-badge outline color="primary" :label="worker.zona" />
              <q-badge
                v-if="worker.verificationStatus === 'APROBADO'"
                color="positive"
                label="Verificado"
                class="q-ml-sm"
              />
            </div>
          </div>

          <!-- Bio -->
          <div class="profile__section">
            <h2 class="profile__section-title">Sobre mí</h2>
            <p>{{ worker.bio }}</p>
          </div>

          <!-- Servicios -->
          <div class="profile__section">
            <h2 class="profile__section-title">Servicios</h2>
            <div class="profile__tags">
              <q-badge
                v-for="s in worker.servicios"
                :key="s"
                outline
                color="accent"
                class="profile__tag"
                :label="s"
              />
            </div>
          </div>

          <!-- Tarifa -->
          <div class="profile__section">
            <h2 class="profile__section-title">Tarifa</h2>
            <p class="profile__price">B/. {{ worker.tarifaHora.toFixed(2) }} por hora</p>
          </div>

          <!-- Disponibilidad -->
          <div class="profile__section">
            <h2 class="profile__section-title">Disponibilidad</h2>
            <div class="availability">
              <div
                v-for="slot in worker.disponibilidad"
                :key="`${slot.dayOfWeek}-${slot.turno}`"
                class="availability__chip"
              >
                {{ dayName(slot.dayOfWeek) }} - {{ slot.turno === 'manana' ? 'Mañana' : 'Tarde' }}
              </div>
            </div>
          </div>

          <!-- Reservar CTA -->
          <q-btn
            unelevated
            no-caps
            color="primary"
            size="lg"
            class="profile__cta"
            :to="`/service-requests/new?workerId=${worker.id}`"
            label="Reservar este trabajador"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useWorkers } from '../composables/useWorkers';
import { dayName } from '@/utils/formatters';

const route = useRoute();
const { worker, isLoading, loadWorkerById } = useWorkers();

onMounted(() => {
  loadWorkerById(route.params.id as string);
});
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

.profile__header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.profile__back {
  margin-top: -4px;
}
.profile__avatar-lg {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  flex-shrink: 0;
}
.profile__header-info {
  flex: 1;
}
.profile__name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  margin: 0 0 var(--space-1);
  color: var(--color-text);
}
.profile__rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
.profile__stars {
  color: var(--color-accent);
  font-weight: var(--weight-semibold);
}

.profile__section {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}
.profile__section-title {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--space-3);
}
.profile__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.profile__tag {
  font-size: var(--text-sm);
  padding: 4px 12px;
}
.profile__price {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-primary);
}

.availability {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.availability__chip {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  border-radius: var(--radius-full);
  padding: 4px 14px;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}

.profile__cta {
  width: 100%;
  margin-top: var(--space-8);
  border-radius: var(--radius-md);
  font-weight: var(--weight-bold);
  padding: 14px;
  box-shadow: 0 4px 14px rgba(13, 110, 110, 0.25);
}
</style>
