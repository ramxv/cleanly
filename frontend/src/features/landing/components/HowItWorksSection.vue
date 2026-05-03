<template>
  <section id="como-funciona" class="how">
    <div class="how__inner">
      <header class="how__header">
        <q-chip dense color="primary-light" text-color="primary" class="how__eyebrow">
          PROCESO
        </q-chip>
        <h2 class="how__title">Cómo funciona</h2>
        <p class="how__subtitle">
          Reservar un servicio toma menos de tres minutos. Así de fácil.
        </p>
      </header>

      <div class="how__grid">
        <article
          v-for="(step, i) in steps"
          :key="step.title"
          class="step"
        >
          <div class="step__num">{{ String(i + 1).padStart(2, '0') }}</div>
          <q-icon :name="step.icon" size="28px" class="step__icon" />
          <h3 class="step__title">{{ step.title }}</h3>
          <p class="step__body">{{ step.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Cuéntanos qué necesitas',
    icon: 'edit_note',
    body: 'Selecciona el tipo de servicio, el tamaño de tu hogar y la fecha que mejor te queda.',
  },
  {
    title: 'Elige a tu trabajador',
    icon: 'person_search',
    body: 'Compara perfiles verificados con calificaciones reales y tarifa por hora transparente.',
  },
  {
    title: 'Reserva y paga seguro',
    icon: 'lock',
    body: 'Tu pago queda en custodia. Lo liberamos cuando confirmas que el servicio quedó bien.',
  },
  {
    title: 'Disfruta tu hogar limpio',
    icon: 'home',
    body: 'Califica al trabajador para ayudar a otras familias panameñas.',
  },
];
</script>

<style scoped>
.how {
  padding: var(--space-20) var(--space-8);
  background: linear-gradient(180deg, var(--color-bg-warm) 0%, #ffffff 100%);
}
.how__inner {
  max-width: var(--content-max);
  margin: 0 auto;
}
.how__header {
  text-align: center;
  margin-bottom: var(--space-12);
}
.how__eyebrow {
  font-size: 11px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
  background: var(--color-primary-light);
}
.how__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-3);
}
.how__subtitle {
  font-size: var(--text-md);
  color: var(--color-text-secondary);
  max-width: 560px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}
.how__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}
.step {
  position: relative;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-5) var(--space-5);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition:
    transform var(--duration-base),
    box-shadow var(--duration-base);
}
.step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.step__num {
  position: absolute;
  top: var(--space-4);
  right: var(--space-5);
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-primary-light);
  line-height: 1;
}
.step__icon {
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}
.step__title {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.step__body {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

@media (max-width: 1100px) {
  .how__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .how__grid {
    grid-template-columns: 1fr;
  }
  .how__title {
    font-size: var(--text-2xl);
  }
}
</style>
