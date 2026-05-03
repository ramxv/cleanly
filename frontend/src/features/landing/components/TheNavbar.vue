<template>
  <q-header reveal class="nav">
    <q-toolbar class="nav__inner">
      <a href="#inicio" class="nav__brand" @click.prevent="scrollTo('inicio')">
        <img src="/logo.svg" alt="Cleanly" height="32" />
      </a>

      <q-space />

      <div class="nav__links gt-sm">
        <q-btn
          v-for="link in links"
          :key="link.target"
          flat
          no-caps
          :label="link.label"
          class="nav__link"
          @click="scrollTo(link.target)"
        />
        <q-btn
          :to="{ name: 'login' }"
          flat
          no-caps
          label="Iniciar sesión"
          class="nav__btn-ghost q-ml-sm"
        />
        <q-btn
          :to="{ name: 'register' }"
          unelevated
          no-caps
          label="Registrarse"
          color="primary"
          class="nav__btn-primary q-ml-sm"
        />
      </div>

      <q-btn
        flat
        round
        dense
        icon="menu"
        class="lt-md"
        aria-label="Menú"
        @click="drawer = !drawer"
      />
    </q-toolbar>

    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      bordered
      :width="280"
      class="lt-md"
    >
      <q-list>
        <q-item
          v-for="link in links"
          :key="link.target"
          v-ripple
          clickable
          @click="onMobileNav(link.target)"
        >
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          v-ripple
          clickable
          :to="{ name: 'login' }"
          @click="drawer = false"
        >
          <q-item-section>Iniciar sesión</q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          :to="{ name: 'register' }"
          @click="drawer = false"
        >
          <q-item-section class="text-primary text-weight-bold">
            Registrarse
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(false);

const links = [
  { label: 'Cómo funciona', target: 'como-funciona' },
  { label: 'Trabajadores', target: 'trabajadores' },
  { label: 'Precios', target: 'precios' },
  { label: 'Ayuda', target: 'ayuda' },
  { label: 'Contacto', target: 'contacto' },
];

function scrollTo(id: string) {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onMobileNav(id: string) {
  drawer.value = false;
  setTimeout(() => scrollTo(id), 200);
}
</script>

<style scoped>
.nav {
  background: rgba(255, 255, 255, 0.85);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
}
.nav__inner {
  max-width: var(--content-max);
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-8);
  height: var(--nav-height);
  min-height: var(--nav-height);
}
.nav__brand {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.nav__links {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}
.nav__link {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
}
.nav__link:hover {
  color: var(--color-text);
}
.nav__btn-ghost {
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
}
.nav__btn-ghost:hover {
  background: var(--color-primary-light);
}
.nav__btn-primary {
  font-weight: var(--weight-semibold);
  box-shadow: 0 4px 14px rgba(13, 110, 110, 0.25);
}
</style>
