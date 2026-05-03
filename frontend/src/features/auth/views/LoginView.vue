<template>
  <q-layout view="hHh Lpr lff" class="auth">
    <q-page-container>
      <q-page class="auth__page">
        <div class="auth__blob auth__blob--teal" aria-hidden="true" />
        <div class="auth__blob auth__blob--amber" aria-hidden="true" />
        <div class="auth__grid" aria-hidden="true" />

        <div class="auth__shell">
          <RouterLink to="/" class="auth__brand" aria-label="Cleanly">
            <img src="/logo.svg" alt="Cleanly" height="36" />
          </RouterLink>

          <div class="card">
            <header class="card__header">
              <h1 class="card__title">Bienvenido de vuelta</h1>
              <p class="card__lead">
                Ingresa a tu cuenta para reservar y gestionar tus servicios.
              </p>
            </header>

            <q-form class="form" @submit.prevent="onSubmit">
              <q-input
                v-model="form.correo"
                type="email"
                label="Correo electrónico"
                stack-label
                outlined
                no-error-icon
                autocomplete="email"
                :rules="[(v) => !!v || 'El correo es obligatorio']"
                lazy-rules
              >
                <template #prepend>
                  <q-icon name="mail_outline" />
                </template>
              </q-input>

              <q-input
                v-model="form.contrasena"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                stack-label
                outlined
                no-error-icon
                autocomplete="current-password"
                :rules="[(v) => !!v || 'La contraseña es obligatoria']"
                lazy-rules
              >
                <template #prepend>
                  <q-icon name="lock_outline" />
                </template>
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <div class="form__row">
                <q-checkbox
                  v-model="form.recordar"
                  label="Recordarme"
                  color="primary"
                  dense
                />
                <a href="#" class="form__link" @click.prevent>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

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
                size="lg"
                label="Iniciar sesión"
                class="form__submit"
                :loading="loading"
              />

              <div class="form__divider">
                <span>o continúa con</span>
              </div>

              <q-btn
                outline
                no-caps
                color="primary"
                icon="img:https://www.google.com/favicon.ico"
                label="Google"
                class="form__oauth"
              />
            </q-form>

            <footer class="card__footer">
              ¿Aún no tienes cuenta?
              <RouterLink to="/registro" class="card__footer-link">
                Crear cuenta
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

const router = useRouter();

const form = reactive({
  correo: '',
  contrasena: '',
  recordar: false,
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push('/');
  } catch {
    error.value = 'No pudimos iniciar sesión. Verifica tus credenciales.';
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
  padding: var(--space-12) var(--space-5);
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
  left: -120px;
  top: -80px;
  width: 460px;
  height: 460px;
  background: var(--color-primary-light);
  opacity: 0.6;
}
.auth__blob--amber {
  right: -80px;
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
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
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
  padding: var(--space-10);
}
.card__header {
  margin-bottom: var(--space-8);
  text-align: center;
}
.card__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.card__lead {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
}
.form__link {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-primary);
}
.form__link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
.form__banner {
  background: var(--color-error-bg);
  color: var(--color-error-text);
  font-size: var(--text-sm);
}
.form__submit {
  margin-top: var(--space-2);
  font-weight: var(--weight-bold);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(13, 110, 110, 0.25);
}
.form__divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  font-weight: var(--weight-semibold);
  margin: var(--space-2) 0;
}
.form__divider::before,
.form__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
.form__oauth {
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
}

.card__footer {
  margin-top: var(--space-8);
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
    padding: var(--space-8) var(--space-6);
    border-radius: var(--radius-xl);
  }
  .card__title {
    font-size: var(--text-xl);
  }
}
</style>
