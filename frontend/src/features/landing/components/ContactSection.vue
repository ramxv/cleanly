<template>
  <section id="contacto" class="contact">
    <div class="contact__inner">
      <div class="contact__intro">
        <q-chip dense color="accent" text-color="white" class="contact__eyebrow">
          CONTACTO
        </q-chip>
        <h2 class="contact__title">¿Necesitas más información?</h2>
        <p class="contact__subtitle">
          Escríbenos y te respondemos lo antes posible. Estamos aquí para ayudarte.
        </p>

        <q-list class="contact__info">
          <q-item class="q-px-none">
            <q-item-section avatar>
              <q-icon name="email" color="accent" size="22px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-semibold text-white">
                hola@cleanly.pa
              </q-item-label>
              <q-item-label caption class="contact__caption">
                Respondemos en menos de 24 horas
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-px-none">
            <q-item-section avatar>
              <q-icon name="call" color="accent" size="22px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-semibold text-white">
                +507 6000-0000
              </q-item-label>
              <q-item-label caption class="contact__caption">
                Lun – Sáb · 8:00 a 20:00
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-px-none">
            <q-item-section avatar>
              <q-icon name="location_on" color="accent" size="22px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-semibold text-white">
                Ciudad de Panamá
              </q-item-label>
              <q-item-label caption class="contact__caption">
                Costa del Este, Panamá
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-card flat class="contact__form-card">
        <q-form class="q-gutter-md" @submit.prevent="onSubmit">
          <q-input
            v-model="form.name"
            outlined
            label="Tu nombre"
            :rules="[(v) => !!v || 'Campo obligatorio']"
          />
          <q-input
            v-model="form.email"
            outlined
            label="Correo electrónico"
            type="email"
            :rules="[
              (v) => !!v || 'Campo obligatorio',
              (v) => /.+@.+\..+/.test(v) || 'Correo inválido',
            ]"
          />
          <q-select
            v-model="form.topic"
            outlined
            :options="topics"
            label="Asunto"
            :rules="[(v) => !!v || 'Selecciona un asunto']"
          />
          <q-input
            v-model="form.message"
            outlined
            type="textarea"
            label="Mensaje"
            autogrow
            :rules="[(v) => !!v || 'Cuéntanos cómo podemos ayudarte']"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Enviar mensaje"
            type="submit"
            class="full-width contact__submit"
            icon-right="send"
          />
        </q-form>
      </q-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const topics = ['Soporte de reserva', 'Pagos', 'Quiero ser trabajador', 'Otro'];

const form = reactive({
  name: '',
  email: '',
  topic: null as string | null,
  message: '',
});

function onSubmit() {
  console.log('contact', { ...form });
}
</script>

<style scoped>
.contact {
  padding: var(--space-20) var(--space-8);
  background:
    radial-gradient(ellipse at top right, rgba(245, 166, 35, 0.15), transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(13, 110, 110, 0.5), transparent 50%),
    var(--color-bg-dark);
  color: var(--color-white);
}
.contact__inner {
  max-width: var(--content-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
}
.contact__intro {
  color: var(--color-white);
}
.contact__eyebrow {
  font-size: 11px;
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}
.contact__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-3);
  line-height: var(--leading-tight);
}
.contact__subtitle {
  font-size: var(--text-md);
  color: rgba(255, 255, 255, 0.75);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
}
.contact__info {
  background: transparent;
}
.contact__caption {
  color: rgba(255, 255, 255, 0.6) !important;
}
.contact__form-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-xl);
  color: var(--color-text);
}
.contact__submit {
  font-weight: var(--weight-bold);
  border-radius: var(--radius-md);
  padding: var(--space-3);
}

@media (max-width: 900px) {
  .contact__inner {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  .contact__title {
    font-size: var(--text-2xl);
  }
  .contact__form-card {
    padding: var(--space-5);
  }
}
</style>
