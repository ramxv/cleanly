<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">Configurar mi perfil</h1>
          <p class="page__subtitle">
            Completa tu perfil para empezar a recibir solicitudes de servicio
          </p>
        </div>

        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando perfil...</p>
        </div>

        <div v-else class="onboarding">
          <!-- Estado de verificación -->
          <div v-if="workerProfile" class="verification-banner" :class="`verification--${workerProfile.verificationStatus}`">
            <span v-if="workerProfile.verificationStatus === 'PENDIENTE'">
              ⏳ Tu cuenta está pendiente de verificación. Serás visible cuando un administrador la apruebe.
            </span>
            <span v-else-if="workerProfile.verificationStatus === 'APROBADO'">
              ✅ Tu cuenta está verificada. ¡Ya puedes recibir reservas!
            </span>
            <span v-else>
              ❌ Tu cuenta fue rechazada. Contacta a soporte.
            </span>
          </div>

          <!-- Bio -->
          <div class="card">
            <h2 class="card__title">Información básica</h2>
            <q-input
              v-model="form.bio"
              type="textarea"
              label="Cuéntanos sobre ti"
              hint="Experiencia, especialidades, zona de cobertura"
              outlined
              autogrow
              :rules="[(v) => !!v || 'La biografía es obligatoria']"
            />
          </div>

          <!-- Servicios -->
          <div class="card">
            <h2 class="card__title">Servicios que ofreces</h2>
            <div class="tags">
              <q-checkbox
                v-for="s in SERVICIOS"
                :key="s"
                v-model="form.servicios"
                :val="s"
                :label="s"
                color="primary"
              />
            </div>
          </div>

          <!-- Tarifa -->
          <div class="card">
            <h2 class="card__title">Tarifa por hora</h2>
            <q-input
              v-model.number="form.tarifaHora"
              type="number"
              label="Tarifa (B/. por hora)"
              outlined
              prefix="B/."
              step="0.5"
              min="5"
              max="50"
              :rules="[(v) => v >= 5 || 'Mínimo B/. 5.00']"
            />
          </div>

          <!-- Zona -->
          <div class="card">
            <h2 class="card__title">Zona de trabajo</h2>
            <q-select
              v-model="form.zona"
              :options="ZONAS"
              label="Selecciona tu zona principal"
              outlined
              :rules="[(v) => !!v || 'Selecciona una zona']"
            />
          </div>

          <!-- Disponibilidad -->
          <div class="card">
            <h2 class="card__title">Disponibilidad semanal</h2>
            <p class="card__hint">Selecciona tus días y turnos</p>
            <div class="availability-grid">
              <div v-for="day in days" :key="day.value" class="availability__day">
                <span class="availability__day-name">{{ day.label }}</span>
                <q-checkbox
                  v-model="form.disponibilidad"
                  :val="{ dayOfWeek: day.value, turno: 'manana' }"
                  label="Mañana"
                  color="primary"
                  dense
                />
                <q-checkbox
                  v-model="form.disponibilidad"
                  :val="{ dayOfWeek: day.value, turno: 'tarde' }"
                  label="Tarde"
                  color="primary"
                  dense
                />
              </div>
            </div>
          </div>

          <!-- Save -->
          <q-btn
            unelevated
            no-caps
            color="primary"
            size="lg"
            label="Guardar perfil"
            class="save-btn"
            :loading="saving"
            @click="handleSave"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useWorkers } from '../composables/useWorkers';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { SERVICIOS, ZONAS } from '@/utils/constants';
import type { TimeSlot } from '@/utils/types';

const { userId } = useAuth();
const { worker: workerProfile, isLoading, loadWorkerByUserId, updateWorker } = useWorkers();
const { success, error: showError } = useToast();

const saving = ref(false);

const days = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

const form = reactive({
  bio: '',
  servicios: [] as string[],
  tarifaHora: 10,
  zona: '',
  disponibilidad: [] as TimeSlot[],
});

onMounted(() => {
  if (userId.value) loadWorkerByUserId(userId.value);
});

// When worker profile loads, populate form
watch(
  () => workerProfile.value,
  (w) => {
    if (w && w.userId === userId.value) {
      form.bio = w.bio;
      form.servicios = [...w.servicios];
      form.tarifaHora = w.tarifaHora;
      form.zona = w.zona;
      form.disponibilidad = [...w.disponibilidad];
    }
  },
  { immediate: true },
);

async function handleSave() {
  if (!workerProfile.value) return;
  saving.value = true;
  try {
    await updateWorker(workerProfile.value.id, {
      bio: form.bio,
      servicios: form.servicios,
      tarifaHora: form.tarifaHora,
      zona: form.zona,
      disponibilidad: form.disponibilidad,
    });
    success('Perfil actualizado correctamente');
  } catch (e: any) {
    showError(e.message || 'Error al guardar');
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
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
}
.page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-20) 0;
  color: var(--color-text-secondary);
}

.verification-banner {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-4);
}
.verification--PENDIENTE {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}
.verification--APROBADO {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}
.verification--RECHAZADO {
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.onboarding {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.card__title {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--space-3);
}
.card__hint {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin: 0 0 var(--space-3);
}

.tags {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.availability-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.availability__day {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.availability__day-name {
  width: 80px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}

.save-btn {
  width: 100%;
  border-radius: var(--radius-md);
  font-weight: var(--weight-bold);
  padding: 14px;
  box-shadow: 0 4px 14px rgba(13, 110, 110, 0.25);
  margin-top: var(--space-4);
}
</style>
