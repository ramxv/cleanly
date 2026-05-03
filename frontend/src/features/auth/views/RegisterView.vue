<template>
  <q-layout view="hHh Lpr lff" class="auth">
    <q-page-container>
      <q-page class="auth__page">
        <div class="auth__blob auth__blob--teal" aria-hidden="true" />
        <div class="auth__blob auth__blob--amber" aria-hidden="true" />
        <div class="auth__grid" aria-hidden="true" />

        <div class="auth__shell">
          <RouterLink to="/" class="auth__brand" aria-label="Cleanly">
            <img src="/logo.svg" alt="Cleanly" height="32" />
          </RouterLink>

          <div class="card">
            <header class="card__header">
              <h1 class="card__title">Crea tu cuenta</h1>
              <p class="card__lead">Reserva servicios confiables en minutos.</p>
            </header>

            <div class="role">
              <button
                v-for="opt in roleOptions"
                :key="opt.value"
                type="button"
                class="role__option"
                :class="{ 'role__option--active': form.rol === opt.value }"
                @click="form.rol = opt.value"
              >
                <q-icon :name="opt.icon" size="18px" />
                <span class="role__label">{{ opt.label }}</span>
              </button>
            </div>

            <q-form class="form" @submit.prevent="onSubmit">
              <q-input
                v-model="form.nombre"
                label="Nombre completo"
                stack-label
                outlined
                dense
                no-error-icon
                autocomplete="name"
                :rules="[(v) => !!v || 'Ingresa tu nombre']"
                lazy-rules
              />

              <q-input
                v-model="form.correo"
                type="email"
                label="Correo electrónico"
                stack-label
                outlined
                dense
                no-error-icon
                autocomplete="email"
                :rules="[
                  (v) => !!v || 'El correo es obligatorio',
                  (v) => /.+@.+\..+/.test(v) || 'Ingresa un correo válido',
                ]"
                lazy-rules
              />

              <q-input
                v-model="form.telefono"
                type="tel"
                label="Teléfono"
                stack-label
                outlined
                dense
                no-error-icon
                placeholder="+507 6000-0000"
                autocomplete="tel"
                :rules="[(v) => !!v || 'Ingresa tu teléfono']"
                lazy-rules
              />

              <q-input
                v-model="form.contrasena"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                stack-label
                outlined
                dense
                no-error-icon
                autocomplete="new-password"
                :rules="[
                  (v) => !!v || 'La contraseña es obligatoria',
                  (v) => v.length >= 8 || 'Mínimo 8 caracteres',
                ]"
                lazy-rules
              >
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    size="18px"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-input
                v-model="form.confirmar"
                :type="showPassword ? 'text' : 'password'"
                label="Confirmar contraseña"
                stack-label
                outlined
                dense
                no-error-icon
                autocomplete="new-password"
                :rules="[
                  (v) => !!v || 'Confirma la contraseña',
                  (v) => v === form.contrasena || 'Las contraseñas no coinciden',
                ]"
                lazy-rules
              />

              <q-checkbox
                v-model="form.terminos"
                color="primary"
                dense
                class="form__terms"
              >
                <span class="form__terms-text">
                  Acepto los
                  <RouterLink to="/terminos" class="form__link">
                    Términos
                  </RouterLink>
                  y la
                  <RouterLink to="/privacidad" class="form__link">
                    Política de Privacidad
                  </RouterLink>
                </span>
              </q-checkbox>

              <q-banner
                v-if="error"
                rounded
                class="form__banner"
                role="alert"
              >
                <template #avatar>
                  <q-icon name="error_outline" />
                </template>
                {{ error }}
              </q-banner>

              <q-btn
                type="submit"
                unelevated
                no-caps
                color="primary"
                label="Crear cuenta"
                class="form__submit"
                :loading="loading"
                :disable="!form.terminos"
              />
            </q-form>

            <footer class="card__footer">
              ¿Ya tienes cuenta?
              <RouterLink to="/login" class="card__footer-link">
                Iniciar sesión
              </RouterLink>
            </footer>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

type Rol = 'CLIENTE' | 'TRABAJADOR';

const router = useRouter();

const form = reactive({
  rol: 'CLIENTE' as Rol,
  nombre: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmar: '',
  terminos: false,
});

const roleOptions: { value: Rol; label: string; icon: string }[] = [
  { value: 'CLIENTE', label: 'Soy cliente', icon: 'home' },
  { value: 'TRABAJADOR', label: 'Soy trabajador', icon: 'cleaning_services' },
];

const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push('/login');
  } catch {
    error.value = 'No pudimos crear tu cuenta. Inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth {
  background: var(--color-bg-warm);
}
.auth__page {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) var(--space-5);
  min-height: 100vh;
}
.auth__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(13, 110, 110, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 110, 110, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at top, black, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at top, black, transparent 70%);
  pointer-events: none;
}
.auth__blob {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  filter: blur(8px);
}
.auth__blob--teal {
  right: -120px;
  top: -100px;
  width: 480px;
  height: 480px;
  background: var(--color-primary-light);
  opacity: 0.6;
}
.auth__blob--amber {
  left: -80px;
  bottom: -60px;
  width: 240px;
  height: 240px;
  background: var(--color-accent-light);
  opacity: 0.5;
}
.auth__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}
.auth__brand {
  display: inline-flex;
}

.card {
  width: 100%;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-6) var(--space-8);
}
.card__header {
  margin-bottom: var(--space-5);
  text-align: center;
}
.card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text);
  margin-bottom: 4px;
}
.card__lead {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
}

.role {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.role__option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 10px var(--space-3);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  transition: all var(--duration-fast) ease;
  color: var(--color-text-secondary);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
.role__option:hover {
  border-color: var(--color-border-strong);
}
.role__option--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.form__terms {
  margin-top: -2px;
}
.form__terms-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
.form__link {
  color: var(--color-primary);
  font-weight: var(--weight-semibold);
}
.form__link:hover {
  text-decoration: underline;
}
.form__banner {
  background: var(--color-error-bg);
  color: var(--color-error-text);
  font-size: var(--text-sm);
}
.form__submit {
  margin-top: var(--space-1);
  font-weight: var(--weight-bold);
  border-radius: var(--radius-md);
  padding: 10px;
  box-shadow: 0 4px 14px rgba(13, 110, 110, 0.25);
}

.card__footer {
  margin-top: var(--space-5);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
.card__footer-link {
  color: var(--color-primary);
  font-weight: var(--weight-semibold);
  margin-left: var(--space-1);
}
.card__footer-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
  }
}
</style>
