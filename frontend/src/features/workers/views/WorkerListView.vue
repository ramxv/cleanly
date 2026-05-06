<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">Trabajadores disponibles</h1>
          <p class="page__subtitle">
            Encuentra profesionales de limpieza verificados en tu zona
          </p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando trabajadores...</p>
        </div>

        <!-- Grid de trabajadores -->
        <div v-else class="workers-grid">
          <div
            v-for="worker in workers"
            :key="worker.id"
            class="worker-card"
            @click="$router.push(`/workers/${worker.id}`)"
          >
            <div class="worker-card__avatar">
              {{ worker.nombre.charAt(0) }}
            </div>
            <div class="worker-card__info">
              <h3 class="worker-card__name">{{ worker.nombre }}</h3>
              <p class="worker-card__bio">{{ worker.bio }}</p>
              <div class="worker-card__rating">
                <span class="worker-card__stars">⭐ {{ worker.avgRating.toFixed(1) }}</span>
                <span class="worker-card__reviews">({{ worker.totalReviews }} reseñas)</span>
              </div>
              <div class="worker-card__meta">
                <q-badge outline color="primary" :label="worker.zona" />
                <span class="worker-card__price">B/. {{ worker.tarifaHora.toFixed(2) }}/h</span>
              </div>
            </div>
            <q-icon name="chevron_right" color="grey-5" size="24px" />
          </div>

          <!-- Empty state -->
          <div v-if="workers.length === 0" class="page__empty">
            <span class="page__empty-icon">🔍</span>
            <h3>No hay trabajadores disponibles</h3>
            <p>Intenta buscar en otra zona o tipo de servicio.</p>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useWorkers } from '../composables/useWorkers';

const { workers, isLoading, loadWorkers } = useWorkers();

onMounted(() => loadWorkers());
</script>

<style scoped>
.page {
  padding: var(--space-6) var(--space-4);
  max-width: var(--content-max);
  margin: 0 auto;
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
  font-size: var(--text-base);
}

.page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-20) 0;
  color: var(--color-text-secondary);
}

.workers-grid {
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
  cursor: pointer;
  transition: box-shadow var(--duration-fast);
}
.worker-card:hover {
  box-shadow: var(--shadow-md);
}

.worker-card__avatar {
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
.worker-card__bio {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.worker-card__rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}
.worker-card__stars {
  color: var(--color-accent);
  font-weight: var(--weight-semibold);
}
.worker-card__reviews {
  color: var(--color-text-tertiary);
}
.worker-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.worker-card__price {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-primary);
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
  font-family: var(--font-display);
  font-size: var(--text-xl);
  margin-bottom: var(--space-2);
  color: var(--color-text);
}
</style>
