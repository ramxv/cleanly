<template>
  <q-layout view="hHh Lpr lff" class="auth">
    <q-page-container>
      <q-page class="auth__page">
        <div class="auth__blob auth__blob--teal" aria-hidden="true" />
        <div class="auth__blob auth__blob--amber" aria-hidden="true" />
        <div class="auth__grid" aria-hidden="true" />

        <div class="auth__shell">
          <RouterLink to="/" class="auth__brand" aria-label="Cleanly">
            <h1 class="auth__logo-text">✨ Cleanly</h1>
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
                v-model="form.email"
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
                v-model="form.password"
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

              <div class="form__hint">
                <span class="form__hint-label">Demo:</span>
                <button type="button" class="form__hint-btn" @click="fillDemo('cliente@email.com', 'Cliente123')">Cliente</button>
                <button type="button" class="form__hint-btn" @click="fillDemo('ana@email.com', 'Trabajador123')">Trabajador</button>
                <button type="button" class="form__hint-btn" @click="fillDemo('admin@cleanly.com', 'Admin123')">Admin</button>
              </div>
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
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { login } = useAuth();

const form = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

function fillDemo(email: string, password: string) {
  form.email = email;
  form.password = password;
}

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await login(form.email, form.password);
  } catch (e: any) {
    error.value = e.message || 'Error al iniciar sesión';
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
  text-decoration: none;
}
.auth__logo-text {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--color-primary);
  margin: 0;
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
.form__hint {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
  font-size: var(--text-xs);
}
.form__hint-label {
  color: var(--color-text-tertiary);
  font-weight: var(--weight-semibold);
}
.form__hint-btn {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  padding: 2px var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.form__hint-btn:hover {
  background: var(--color-primary);
  color: white;
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
}
</style>
