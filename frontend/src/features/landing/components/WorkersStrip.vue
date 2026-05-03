<template>
  <section id="trabajadores" class="strip">
    <header class="strip__header">
      <div>
        <q-chip dense color="primary-light" text-color="primary" class="strip__eyebrow">
          NUESTRO EQUIPO
        </q-chip>
        <h2 class="strip__title">Trabajadores disponibles hoy</h2>
        <p class="strip__subtitle">Seleccionados según calificación y disponibilidad</p>
      </div>
      <div class="strip__nav gt-sm">
        <q-btn
          round
          flat
          dense
          icon="chevron_left"
          color="primary"
          class="strip__nav-btn"
          aria-label="Anterior"
          @click="prev"
        />
        <q-btn
          round
          flat
          dense
          icon="chevron_right"
          color="primary"
          class="strip__nav-btn"
          aria-label="Siguiente"
          @click="next"
        />
      </div>
    </header>

    <q-carousel
      ref="carouselRef"
      v-model="slide"
      animated
      swipeable
      infinite
      :autoplay="6000"
      transition-prev="slide-right"
      transition-next="slide-left"
      class="strip__carousel"
      control-color="primary"
    >
      <q-carousel-slide
        v-for="(group, idx) in groups"
        :key="idx"
        :name="idx"
        class="strip__slide"
      >
        <div class="strip__row">
          <q-card
            v-for="w in group"
            :key="w.id"
            flat
            class="card"
          >
            <div class="card__top">
              <div class="card__avatar">
                <q-avatar size="64px" class="card__avatar-circle">
                  {{ w.initials }}
                </q-avatar>
                <q-icon name="verified" class="card__verified" />
              </div>
              <q-chip
                v-if="w.featured"
                dense
                color="accent"
                text-color="white"
                icon="bolt"
                class="card__badge"
              >
                Top
              </q-chip>
            </div>
            <div class="card__name">{{ w.name }}</div>
            <div class="card__zone">{{ w.zone }}</div>
            <div class="card__meta">
              <q-icon name="star" size="14px" style="color: #f5a623" />
              <span>{{ w.rating.toFixed(1) }}</span>
              <span class="card__reviews">({{ w.reviews }})</span>
            </div>
            <div class="card__price">
              <span class="card__amount">B/. {{ w.rate }}</span>
              <span class="card__unit">/hora</span>
            </div>
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="card__cta"
              label="Reservar"
            />
          </q-card>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div class="strip__dots">
      <button
        v-for="(_, i) in groups"
        :key="i"
        type="button"
        :class="['strip__dot', { 'strip__dot--active': slide === i }]"
        :aria-label="`Ir al grupo ${i + 1}`"
        @click="slide = i"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QCarousel } from 'quasar';

const slide = ref(0);
const carouselRef = ref<QCarousel | null>(null);

const workers = [
  { id: '1', name: 'María Pérez', initials: 'MP', zone: 'Paitilla', rating: 4.9, reviews: 87, rate: 8, featured: true },
  { id: '2', name: 'Lucía Gómez', initials: 'LG', zone: 'San Francisco', rating: 4.8, reviews: 64, rate: 9, featured: false },
  { id: '3', name: 'Ana Castillo', initials: 'AC', zone: 'Costa del Este', rating: 5.0, reviews: 42, rate: 10, featured: true },
  { id: '4', name: 'Carmen Ruiz', initials: 'CR', zone: 'Bella Vista', rating: 4.7, reviews: 31, rate: 7, featured: false },
  { id: '5', name: 'Sofía Mendoza', initials: 'SM', zone: 'El Cangrejo', rating: 4.9, reviews: 58, rate: 9, featured: false },
  { id: '6', name: 'Patricia Vega', initials: 'PV', zone: 'Obarrio', rating: 4.6, reviews: 23, rate: 8, featured: false },
  { id: '7', name: 'Rosa Aguilar', initials: 'RA', zone: 'Albrook', rating: 4.8, reviews: 39, rate: 8, featured: false },
  { id: '8', name: 'Elena Torres', initials: 'ET', zone: 'Punta Pacífica', rating: 5.0, reviews: 71, rate: 11, featured: true },
];

const PER_SLIDE = 4;
const groups = computed(() => {
  const out: (typeof workers)[] = [];
  for (let i = 0; i < workers.length; i += PER_SLIDE) {
    out.push(workers.slice(i, i + PER_SLIDE));
  }
  return out;
});

function next() {
  carouselRef.value?.next();
}
function prev() {
  carouselRef.value?.previous();
}
</script>

<style scoped>
.strip {
  padding: var(--space-16) 0 var(--space-20);
  position: relative;
}
.strip::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(13, 110, 110, 0.04),
    transparent 60%
  );
  pointer-events: none;
}
.strip__header {
  max-width: var(--content-max);
  margin: 0 auto var(--space-8);
  padding: 0 var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-4);
  position: relative;
}
.strip__eyebrow {
  font-size: 11px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
  background: var(--color-primary-light);
}
.strip__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-2);
}
.strip__subtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}
.strip__nav {
  display: flex;
  gap: var(--space-2);
}
.strip__nav-btn {
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.strip__carousel {
  background: transparent;
  height: auto !important;
  min-height: 360px;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 var(--space-8);
}
.strip__carousel :deep(.q-carousel__slide) {
  padding: var(--space-2);
}
.strip__carousel :deep(.q-carousel__navigation),
.strip__carousel :deep(.q-carousel__arrow) {
  display: none;
}
.strip__slide {
  background: transparent;
}
.strip__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

.card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition:
    transform var(--duration-base),
    box-shadow var(--duration-base);
  border: 1px solid transparent;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-light);
}
.card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
}
.card__avatar {
  position: relative;
  width: 64px;
  height: 64px;
}
.card__avatar-circle {
  background: linear-gradient(135deg, var(--color-primary-light), #d1ebeb);
  color: var(--color-primary);
  font-weight: var(--weight-bold);
  font-size: var(--text-lg);
}
.card__verified {
  position: absolute;
  right: -4px;
  bottom: -4px;
  background: var(--color-white);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  padding: 2px;
  font-size: 20px;
  box-shadow: var(--shadow-sm);
}
.card__badge {
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-wide);
}
.card__name {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--color-text);
}
.card__zone {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  font-weight: var(--weight-semibold);
}
.card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}
.card__reviews {
  color: var(--color-text-tertiary);
  font-weight: var(--weight-regular);
}
.card__price {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  margin-top: var(--space-2);
}
.card__amount {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-primary);
}
.card__unit {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.card__cta {
  margin-top: var(--space-3);
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
}

.strip__dots {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
}
.strip__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-border-strong);
  border: none;
  cursor: pointer;
  transition:
    width var(--duration-base),
    background var(--duration-base);
  padding: 0;
}
.strip__dot--active {
  width: 28px;
  background: var(--color-primary);
}

@media (max-width: 1100px) {
  .strip__row {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .strip__row {
    grid-template-columns: 1fr;
  }
  .strip__title {
    font-size: var(--text-2xl);
  }
}
</style>
