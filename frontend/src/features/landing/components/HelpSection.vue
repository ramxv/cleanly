<template>
  <section id="ayuda" class="help">
    <div class="help__inner">
      <header class="help__header">
        <q-chip dense color="primary-light" text-color="primary" class="help__eyebrow">
          AYUDA
        </q-chip>
        <h2 class="help__title">Preguntas frecuentes</h2>
        <p class="help__subtitle">
          Resolvemos tus dudas antes de tu primera reserva.
        </p>
      </header>

      <div class="help__layout">
        <div class="help__categories">
          <q-card
            v-for="cat in categories"
            :key="cat.title"
            flat
            class="help-card"
          >
            <q-icon :name="cat.icon" color="primary" size="32px" />
            <div class="help-card__title">{{ cat.title }}</div>
            <div class="help-card__desc">{{ cat.desc }}</div>
          </q-card>
        </div>

        <q-list bordered separator class="help__faqs">
          <q-expansion-item
            v-for="faq in faqs"
            :key="faq.q"
            :label="faq.q"
            expand-separator
            header-class="text-weight-semibold"
          >
            <q-card flat>
              <q-card-section class="text-body2 text-grey-8">
                {{ faq.a }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const categories = [
  { icon: 'event_available', title: 'Reservas', desc: 'Cómo reservar, cambiar o cancelar' },
  { icon: 'credit_card', title: 'Pagos', desc: 'Métodos y reembolsos' },
  { icon: 'verified_user', title: 'Cuenta', desc: 'Seguridad y verificación' },
  { icon: 'support_agent', title: 'Soporte', desc: 'Disputas y problemas' },
];

const faqs = [
  { q: '¿Cómo reservo un servicio?', a: 'Desde la página principal, completa el formulario de búsqueda, elige al trabajador y confirma la fecha y hora.' },
  { q: '¿Puedo cambiar la fecha de mi reserva?', a: 'Sí, puedes reprogramar hasta 24 horas antes del servicio sin costo.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito y débito, además de PagueloFácil para clientes en Panamá.' },
  { q: '¿Cómo reporto un problema?', a: 'Desde la página de tu reserva puedes abrir una disputa. Nuestro equipo de soporte te responderá en menos de 24 horas.' },
  { q: '¿Cómo verifican a los trabajadores?', a: 'Validamos identidad, antecedentes y referencias antes de aprobar a un trabajador en la plataforma.' },
];
</script>

<style scoped>
.help {
  padding: var(--space-20) var(--space-8);
  background: var(--color-white);
}
.help__inner {
  max-width: var(--content-max);
  margin: 0 auto;
}
.help__header {
  text-align: center;
  margin-bottom: var(--space-12);
}
.help__eyebrow {
  font-size: 11px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
  background: var(--color-primary-light);
}
.help__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-3);
}
.help__subtitle {
  font-size: var(--text-md);
  color: var(--color-text-secondary);
}
.help__layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-8);
  align-items: start;
}
.help__categories {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.help-card {
  background: var(--color-bg-warm);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-4);
  text-align: center;
  border: 1px solid var(--color-border);
  transition:
    transform var(--duration-base),
    box-shadow var(--duration-base),
    border-color var(--duration-base);
  cursor: pointer;
}
.help-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}
.help-card__title {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin-top: var(--space-2);
}
.help-card__desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}
.help__faqs {
  border-radius: var(--radius-lg);
  background: var(--color-white);
  overflow: hidden;
}

@media (max-width: 900px) {
  .help__layout {
    grid-template-columns: 1fr;
  }
  .help__title {
    font-size: var(--text-2xl);
  }
}
</style>
