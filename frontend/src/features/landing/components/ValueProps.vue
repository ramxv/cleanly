<template>
  <section class="props">
    <div class="props__inner">
      <div class="props__grid">
        <q-card
          v-for="vp in items"
          :key="vp.title"
          flat
          class="prop"
        >
          <div class="prop__icon-wrap">
            <q-icon :name="vp.icon" size="28px" class="prop__icon" />
          </div>
          <h3 class="prop__title">{{ vp.title }}</h3>
          <p class="prop__desc">{{ vp.desc }}</p>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    icon: 'verified_user',
    title: 'Trabajadores verificados',
    desc: 'Todos pasan por verificación de identidad y antecedentes antes de unirse.',
  },
  {
    icon: 'lock',
    title: 'Pago seguro',
    desc: 'Tu dinero está protegido. Solo liberamos el pago cuando el servicio se completa.',
  },
  {
    icon: 'star',
    title: 'Calificaciones reales',
    desc: 'Cada reseña es de un cliente verificado que completó el servicio.',
  },
];
</script>

<style scoped>
.props {
  background: var(--color-white);
  padding: var(--space-12) var(--space-8) var(--space-20);
}
.props__inner {
  max-width: var(--content-max);
  margin: 0 auto;
}
.props__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}
.prop {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  border: 1px solid var(--color-border);
  transition:
    transform var(--duration-base),
    border-color var(--duration-base),
    box-shadow var(--duration-base);
  position: relative;
  overflow: hidden;
}
.prop::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base);
}
.prop:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}
.prop:hover::before {
  transform: scaleX(1);
}
.prop__icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary-light), #d1ebeb);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
}
.prop__icon {
  color: var(--color-primary);
}
.prop__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.prop__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

@media (max-width: 900px) {
  .props__grid {
    grid-template-columns: 1fr;
  }
}
</style>
