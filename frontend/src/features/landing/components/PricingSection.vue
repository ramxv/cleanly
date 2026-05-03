<template>
  <section id="precios" class="pricing">
    <div class="pricing__inner">
      <header class="pricing__header">
        <q-chip dense color="primary-light" text-color="primary" class="pricing__eyebrow">
          TARIFAS
        </q-chip>
        <h2 class="pricing__title">Precios transparentes</h2>
        <p class="pricing__subtitle">
          Sin cargos ocultos, sin sorpresas. Paga solo por lo que necesitas.
        </p>
      </header>

      <div class="pricing__grid">
        <q-card
          v-for="plan in plans"
          :key="plan.name"
          flat
          :class="['plan', { 'plan--featured': plan.featured }]"
        >
          <q-badge
            v-if="plan.featured"
            color="accent"
            text-color="white"
            class="plan__badge"
          >
            MÁS POPULAR
          </q-badge>
          <div class="plan__name">{{ plan.name }}</div>
          <p class="plan__desc">{{ plan.desc }}</p>
          <div class="plan__price">
            <span class="plan__currency">B/.</span>
            <span class="plan__amount">{{ plan.rate }}</span>
            <span class="plan__unit">/hora</span>
          </div>
          <q-separator class="q-my-md" />
          <ul class="plan__features">
            <li v-for="feat in plan.features" :key="feat">
              <q-icon name="check_circle" color="primary" size="18px" />
              {{ feat }}
            </li>
          </ul>
          <q-btn
            unelevated
            no-caps
            :color="plan.featured ? 'primary' : 'grey-3'"
            :text-color="plan.featured ? 'white' : 'primary'"
            class="plan__cta"
            label="Reservar ahora"
            href="#inicio"
          />
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const plans = [
  {
    name: 'Estándar',
    rate: 7,
    desc: 'Mantén tu hogar al día con limpieza superficial.',
    features: ['Hasta 3 horas', 'Productos básicos incluidos', 'Trabajador verificado'],
    featured: false,
  },
  {
    name: 'Profunda',
    rate: 10,
    desc: 'Limpieza a fondo de cada rincón. Ideal cada trimestre.',
    features: [
      'Mínimo 4 horas',
      'Productos premium',
      'Limpieza de electrodomésticos',
      'Trabajador con experiencia avanzada',
    ],
    featured: true,
  },
  {
    name: 'Post-obra',
    rate: 13,
    desc: 'Para casas o apartamentos recién remodelados.',
    features: ['Equipo especializado', 'Mínimo 5 horas', 'Aspiradora industrial'],
    featured: false,
  },
];
</script>

<style scoped>
.pricing {
  padding: var(--space-20) var(--space-8);
  background: var(--color-bg-warm);
}
.pricing__inner {
  max-width: var(--content-max);
  margin: 0 auto;
}
.pricing__header {
  text-align: center;
  margin-bottom: var(--space-12);
}
.pricing__eyebrow {
  font-size: 11px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
  background: var(--color-primary-light);
}
.pricing__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-3);
}
.pricing__subtitle {
  font-size: var(--text-md);
  color: var(--color-text-secondary);
  max-width: 560px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}
.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  align-items: stretch;
}
.plan {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  border: 1px solid var(--color-border);
  position: relative;
  display: flex;
  flex-direction: column;
  transition:
    transform var(--duration-base),
    box-shadow var(--duration-base);
}
.plan:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.plan--featured {
  border-color: var(--color-primary);
  background: linear-gradient(
    180deg,
    var(--color-white) 0%,
    var(--color-primary-light) 100%
  );
  box-shadow: var(--shadow-lg);
  transform: translateY(-8px);
}
.plan__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-caps);
  padding: 4px var(--space-3);
}
.plan__name {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.plan__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-5);
  min-height: 44px;
}
.plan__price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.plan__currency {
  font-size: var(--text-md);
  font-weight: var(--weight-semibold);
  color: var(--color-text-secondary);
}
.plan__amount {
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: var(--weight-bold);
  color: var(--color-primary);
  line-height: 1;
}
.plan__unit {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
.plan__features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}
.plan__features li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text);
}
.plan__cta {
  margin-top: var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
}

@media (max-width: 1100px) {
  .pricing__grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
  .plan--featured {
    transform: none;
  }
}
</style>
