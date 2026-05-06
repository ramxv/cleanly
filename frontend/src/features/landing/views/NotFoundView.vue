<template>
  <q-layout view="hHh Lpr lff" class="not-found" v-cloak>
    <q-page-container>
      <q-page class="not-found__page">
        <div class="not-found__content">
          <span class="not-found__emoji">🧹</span>
          <h1 class="not-found__code">404</h1>
          <h2 class="not-found__title">Página no encontrada</h2>
          <p class="not-found__lead">
            Parece que esta página se la llevó la limpieza profunda.
          </p>
          <q-btn
            unelevated
            no-caps
            color="primary"
            size="lg"
            to="/"
            label="Volver al inicio"
            class="not-found__btn"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.not-found {
  background: var(--color-bg-warm);
}
.not-found__page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-8);
}
.not-found__content {
  text-align: center;
  max-width: 420px;
}
.not-found__emoji {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-4);
}
.not-found__code {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: var(--weight-extrabold);
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--space-2);
}
.not-found__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin-bottom: var(--space-3);
}
.not-found__lead {
  color: var(--color-text-secondary);
  font-size: var(--text-md);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
}
.not-found__btn {
  border-radius: var(--radius-md);
  font-weight: var(--weight-bold);
}
</style>
