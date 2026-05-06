<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">Buscar servicio de limpieza</h1>
          <p class="page__subtitle">
            Encuentra al trabajador ideal para tu hogar u oficina
          </p>
        </div>

        <div class="form-card">
          <q-form @submit.prevent="onSubmit">
            <!-- Tipo de servicio -->
            <q-select
              v-model="form.servicio"
              :options="SERVICIOS"
              label="Tipo de servicio"
              outlined
              emit-value
              :rules="[(v) => !!v || 'Selecciona un servicio']"
              class="form-field"
            />

            <!-- Zona -->
            <q-select
              v-model="form.zona"
              :options="ZONAS"
              label="Zona"
              outlined
              :rules="[(v) => !!v || 'Selecciona una zona']"
              class="form-field"
            />

            <!-- Fecha -->
            <q-input
              v-model="form.fecha"
              type="date"
              label="Fecha del servicio"
              outlined
              :min="minDate"
              :rules="[(v) => !!v || 'Selecciona una fecha']"
              hint="Debe ser con al menos 24h de anticipación"
              class="form-field"
            />

            <!-- Tamaño de propiedad -->
            <q-select
              v-model="form.tamanoPropiedad"
              :options="tamanoOptions"
              label="Tamaño de la propiedad"
              outlined
              emit-value
              :rules="[(v) => !!v || 'Selecciona un tamaño']"
              class="form-field"
            />

            <!-- Horas -->
            <q-input
              v-model.number="form.horas"
              type="number"
              label="Horas estimadas"
              outlined
              :min="2"
              :max="12"
              step="1"
              :rules="[
                (v) => v >= 2 || 'Mínimo 2 horas',
                (v) => v <= 12 || 'Máximo 12 horas',
              ]"
              class="form-field"
            />

            <!-- Notas -->
            <q-input
              v-model="form.notas"
              type="textarea"
              label="Notas adicionales (opcional)"
              outlined
              autogrow
              class="form-field"
            />

            <q-banner v-if="errorMsg" rounded class="form-error">
              <template #avatar>
                <q-icon name="error_outline" />
              </template>
              {{ errorMsg }}
            </q-banner>

            <q-btn
              type="submit"
              unelevated
              no-caps
              color="primary"
              size="lg"
              label="Buscar trabajadores"
              class="form-submit"
              :loading="loading"
            />
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useServiceRequests } from '../composables/useServiceRequests';
import { SERVICIOS, ZONAS, TAMANOS_PROPIEDAD } from '@/utils/constants';

const router = useRouter();
const { searchWorkers } = useServiceRequests();

const form = reactive({
  servicio: '',
  zona: '',
  fecha: '',
  tamanoPropiedad: '',
  horas: 4,
  notas: '',
});

const loading = ref(false);
const errorMsg = ref<string | null>(null);

const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  return tomorrow.toISOString().split('T')[0];
});

const tamanoOptions = TAMANOS_PROPIEDAD.map((t) => ({
  label: t.label,
  value: t.value,
}));

async function onSubmit() {
  errorMsg.value = null;
  loading.value = true;
  try {
    await searchWorkers({
      servicio: form.servicio,
      zona: form.zona,
      fecha: form.fecha,
      horas: form.horas,
      tamanoPropiedad: form.tamanoPropiedad,
      notas: form.notas || undefined,
    });
    router.push('/service-requests/results');
  } catch (e: any) {
    errorMsg.value = e.message || 'Error al buscar trabajadores';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-warm);
  min-height: calc(100vh - var(--nav-height));
}
.page__header {
  margin-bottom: var(--space-6);
  text-align: center;
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
}

.form-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
}
.form-field {
  margin-bottom: var(--space-4);
}
.form-error {
  background: var(--color-error-bg);
  color: var(--color-error-text);
  margin-bottom: var(--space-4);
}
.form-submit {
  width: 100%;
  border-radius: var(--radius-md);
  font-weight: var(--weight-bold);
  padding: 14px;
  box-shadow: 0 4px 14px rgba(13, 110, 110, 0.25);
  margin-top: var(--space-4);
}

@media (max-width: 600px) {
  .form-card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
  }
}
</style>
