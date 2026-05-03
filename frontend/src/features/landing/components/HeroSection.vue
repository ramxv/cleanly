<template>
  <section id="inicio" class="hero">
    <div class="hero__blob hero__blob--teal" aria-hidden="true" />
    <div class="hero__blob hero__blob--amber" aria-hidden="true" />
    <div class="hero__grid" aria-hidden="true" />

    <div class="hero__inner">
      <div class="hero__content">
        <q-chip
          square
          dense
          color="primary"
          text-color="white"
          icon="bolt"
          class="hero__pill"
        >
          DISPONIBLE EN PANAMÁ
        </q-chip>

        <h1 class="hero__title">
          Tu hogar limpio,<br />
          <span class="hero__title-accent">sin complicaciones</span>
        </h1>
        <p class="hero__lead">
          Conectamos familias panameñas con trabajadores de limpieza verificados.
          Reserva en minutos, paga seguro, vive tranquilo.
        </p>

        <q-form class="search" @submit="onSearch">
          <q-select
            v-model="serviceType"
            :options="serviceOptions"
            label="Tipo de servicio"
            stack-label
            borderless
            dense
            class="search__field"
            hide-bottom-space
          />
          <q-separator vertical class="search__divider" />
          <q-select
            v-model="propSize"
            :options="sizeOptions"
            label="Tamaño"
            stack-label
            borderless
            dense
            class="search__field"
            hide-bottom-space
          />
          <q-separator vertical class="search__divider" />
          <q-input
            v-model="date"
            type="date"
            label="Fecha"
            stack-label
            borderless
            dense
            class="search__field"
            hide-bottom-space
          />
          <q-separator vertical class="search__divider" />
          <q-input
            v-model="neighborhood"
            label="Barrio"
            placeholder="Miraflores, Paitilla…"
            stack-label
            borderless
            dense
            class="search__field"
            hide-bottom-space
          />
          <q-btn
            type="submit"
            unelevated
            no-caps
            color="primary"
            icon="search"
            label="Buscar"
            class="search__submit"
          />
        </q-form>

        <div class="hero__stats">
          <div class="stat">
            <div class="stat__num">1,200<span>+</span></div>
            <div class="stat__label">Trabajadores verificados</div>
          </div>
          <div class="stat__divider" aria-hidden="true" />
          <div class="stat">
            <div class="stat__num">4.9<span>★</span></div>
            <div class="stat__label">Calificación promedio</div>
          </div>
          <div class="stat__divider" aria-hidden="true" />
          <div class="stat">
            <div class="stat__num">15<span>min</span></div>
            <div class="stat__label">Confirmación promedio</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const serviceType = ref<string | null>(null);
const propSize = ref<string | null>(null);
const date = ref('');
const neighborhood = ref('');

const serviceOptions = ['Estándar', 'Profunda', 'Post-obra'];
const sizeOptions = ['Estudio / 1 hab', '2–3 habitaciones', '4+ habitaciones'];

const emit = defineEmits<{
  search: [{ serviceType: string; propSize: string; date: string; neighborhood: string }];
}>();

function onSearch() {
  emit('search', {
    serviceType: serviceType.value ?? '',
    propSize: propSize.value ?? '',
    date: date.value,
    neighborhood: neighborhood.value,
  });
}
</script>

<style scoped>
.hero {
  background: var(--color-white);
  padding: var(--space-20) var(--space-8) 96px;
  position: relative;
  overflow: hidden;
}
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(13, 110, 110, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 110, 110, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at top right, black, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at top right, black, transparent 70%);
  pointer-events: none;
}
.hero__blob {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  filter: blur(8px);
}
.hero__blob--teal {
  right: -80px;
  top: -60px;
  width: 500px;
  height: 500px;
  background: var(--color-primary-light);
  opacity: 0.6;
}
.hero__blob--amber {
  right: 120px;
  bottom: -40px;
  width: 200px;
  height: 200px;
  background: var(--color-accent-light);
  opacity: 0.5;
}
.hero__inner {
  max-width: var(--content-max);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.hero__content {
  max-width: 720px;
}
.hero__pill {
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--space-6);
  border-radius: var(--radius-full);
  padding: 4px 14px;
  box-shadow: 0 4px 12px rgba(13, 110, 110, 0.25);
}
.hero__title {
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: var(--weight-bold);
  line-height: 1.05;
  letter-spacing: var(--tracking-tight);
  color: var(--color-text);
  margin-bottom: var(--space-5);
}
.hero__title-accent {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-mid));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero__lead {
  font-size: var(--text-md);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-10);
  max-width: 540px;
}

.search {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: stretch;
  border: 1px solid var(--color-border);
  overflow: hidden;
  backdrop-filter: blur(20px);
}
.search__field {
  flex: 1;
  min-width: 0;
  padding: var(--space-2) var(--space-4);
}
.search__divider {
  margin: var(--space-3) 0;
}
.search__submit {
  padding: 0 var(--space-8);
  font-size: 15px;
  font-weight: var(--weight-bold);
  border-radius: 0;
  white-space: nowrap;
}

.hero__stats {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-top: var(--space-10);
  flex-wrap: wrap;
}
.stat__num {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-primary);
  line-height: 1;
}
.stat__num span {
  font-size: var(--text-md);
  color: var(--color-accent);
  margin-left: 2px;
}
.stat__label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  font-weight: var(--weight-semibold);
  margin-top: 2px;
}
.stat__divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

@media (max-width: 900px) {
  .hero {
    padding: var(--space-12) var(--space-5) var(--space-16);
  }
  .hero__title {
    font-size: 40px;
  }
  .search {
    flex-direction: column;
  }
  .search__divider {
    display: none;
  }
  .search__submit {
    padding: var(--space-4);
    justify-content: center;
  }
  .stat__divider {
    display: none;
  }
}
</style>
