<template>
  <q-header elevated class="navbar">
    <q-toolbar>
      <RouterLink to="/" class="navbar__brand">
        ✨ <span class="navbar__brand-text">Cleanly</span>
      </RouterLink>

      <q-space />

      <q-tabs v-if="isAuthenticated" shrink stretch class="navbar__tabs">
        <q-route-tab
          v-if="isClient"
          to="/service-requests/new"
          label="Buscar"
          icon="search"
        />
        <q-route-tab
          v-if="isClient || isWorker"
          to="/bookings"
          label="Reservas"
          icon="event"
        />
        <q-route-tab
          v-if="isClient || isWorker"
          to="/workers"
          label="Trabajadores"
          icon="groups"
        />
        <q-route-tab
          v-if="isClient"
          to="/payments"
          label="Pagos"
          icon="payments"
        />
        <q-route-tab
          v-if="isClient"
          to="/loyalty"
          label="Lealtad"
          icon="card_giftcard"
        />
        <q-route-tab
          v-if="isWorker"
          to="/worker/onboarding"
          label="Mi Perfil"
          icon="person"
        />
        <q-route-tab
          v-if="isAdmin"
          to="/admin/dashboard"
          label="Dashboard"
          icon="dashboard"
        />
        <q-route-tab
          v-if="isAdmin"
          to="/admin/workers"
          label="Verificar"
          icon="verified_user"
        />
      </q-tabs>

      <q-space />

      <div v-if="isAuthenticated" class="navbar__user">
        <q-btn flat round icon="account_circle">
          <q-menu>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ currentUser?.nombre }}
                  </q-item-label>
                  <q-item-label caption>{{ currentUser?.email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label class="text-negative">Cerrar sesión</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <div v-else class="navbar__guest">
        <q-btn flat no-caps to="/login" label="Iniciar sesión" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          to="/registro"
          label="Registrarse"
          class="navbar__cta"
        />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { currentUser, isAuthenticated, isClient, isWorker, isAdmin, logout } =
  useAuth();
</script>

<style scoped>
.navbar {
  background: var(--color-white) !important;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text) !important;
}
.navbar :deep(.q-toolbar) {
  padding: 0 var(--space-8);
  min-height: var(--nav-height);
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  color: var(--color-primary);
  text-decoration: none;
  font-family: var(--font-display);
  font-weight: var(--weight-bold);
}
.navbar__brand-text {
  color: var(--color-text);
}
.navbar__tabs {
  color: var(--color-text-secondary);
}
.navbar__tabs :deep(.q-tab--active) {
  color: var(--color-primary);
}
.navbar__user {
  display: flex;
  align-items: center;
}
.navbar__guest {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.navbar__cta {
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
}

@media (max-width: 768px) {
  .navbar :deep(.q-toolbar) {
    padding: 0 var(--space-4);
  }
  .navbar__tabs {
    display: none;
  }
}
</style>
