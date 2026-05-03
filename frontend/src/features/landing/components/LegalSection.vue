<template>
  <section id="legal" class="legal">
    <div class="legal__inner">
      <header class="legal__header">
        <q-chip dense color="primary-light" text-color="primary" class="legal__eyebrow">
          INFORMACIÓN LEGAL
        </q-chip>
        <h2 class="legal__title">Transparencia ante todo</h2>
        <p class="legal__subtitle">
          Conoce nuestros términos de uso y cómo protegemos tus datos.
        </p>
      </header>

      <q-card flat class="legal__card">
        <q-tabs
          v-model="tab"
          dense
          align="left"
          active-color="primary"
          indicator-color="primary"
          class="text-grey-7 legal__tabs"
          no-caps
        >
          <q-tab name="terms" label="Términos" icon="description" />
          <q-tab name="privacy" label="Privacidad" icon="shield" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel id="terminos" name="terms" class="legal__panel">
            <h3>1. Aceptación de los términos</h3>
            <p>
              Al utilizar Cleanly aceptas los presentes Términos y Condiciones. Si no estás
              de acuerdo, te pedimos no usar la plataforma.
            </p>
            <h3>2. Descripción del servicio</h3>
            <p>
              Cleanly es una plataforma que conecta a personas que necesitan servicios de
              limpieza doméstica con trabajadores independientes verificados en Panamá.
            </p>
            <h3>3. Reservas y pagos</h3>
            <p>
              Los pagos se procesan de forma segura y se mantienen en custodia hasta que el
              servicio se completa. En caso de disputa, puedes abrir un reclamo dentro de
              las 48 horas siguientes.
            </p>
            <h3>4. Cancelaciones</h3>
            <p>
              Las cancelaciones realizadas con más de 24 horas de anticipación reciben
              reembolso completo. Las cancelaciones tardías pueden estar sujetas a un
              cargo del 30%.
            </p>
          </q-tab-panel>

          <q-tab-panel id="privacidad" name="privacy" class="legal__panel">
            <h3>1. Información que recopilamos</h3>
            <p>
              Recopilamos los datos que nos proporcionas al registrarte (nombre, correo,
              teléfono), información de pago procesada por nuestros proveedores y datos
              de uso para mejorar tu experiencia.
            </p>
            <h3>2. Cómo usamos tu información</h3>
            <p>
              Usamos tus datos para gestionar reservas, procesar pagos y comunicarnos
              contigo sobre el servicio.
            </p>
            <h3>3. Con quién la compartimos</h3>
            <p>
              Compartimos información estrictamente necesaria con los trabajadores
              asignados a cada reserva y con nuestros procesadores de pago. No vendemos
              tus datos a terceros.
            </p>
            <h3>4. Tus derechos</h3>
            <p>
              Puedes acceder, corregir o eliminar tus datos en cualquier momento desde tu
              cuenta o escribiéndonos a privacidad@cleanly.pa.
            </p>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

type LegalTab = 'terms' | 'privacy';

const props = withDefaults(defineProps<{ initial?: LegalTab }>(), {
  initial: 'terms',
});

const tab = ref<LegalTab>(props.initial);

watch(
  () => props.initial,
  (v) => {
    tab.value = v;
  },
);
</script>

<style scoped>
.legal {
  padding: var(--space-20) var(--space-8);
  background: var(--color-bg-warm);
}
.legal__inner {
  max-width: 960px;
  margin: 0 auto;
}
.legal__header {
  text-align: center;
  margin-bottom: var(--space-10);
}
.legal__eyebrow {
  font-size: 11px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
  background: var(--color-primary-light);
}
.legal__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-3);
}
.legal__subtitle {
  font-size: var(--text-md);
  color: var(--color-text-secondary);
}
.legal__card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
}
.legal__tabs {
  padding: 0 var(--space-4);
}
.legal__panel {
  padding: var(--space-8);
}
.legal__panel :deep(h3) {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: var(--space-5) 0 var(--space-2);
}
.legal__panel :deep(h3:first-child) {
  margin-top: 0;
}
.legal__panel :deep(p) {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

@media (max-width: 600px) {
  .legal__title {
    font-size: var(--text-2xl);
  }
  .legal__panel {
    padding: var(--space-5);
  }
}
</style>
