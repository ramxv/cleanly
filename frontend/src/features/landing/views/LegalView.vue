<template>
  <q-layout view="hHh Lpr lff" class="legal-view">
    <TheNavbar />
    <q-page-container>
      <q-page>
        <LegalSection :initial="initial" />
      </q-page>
    </q-page-container>
    <TheFooter />
  </q-layout>
</template>

<script setup lang="ts">
import TheNavbar from '../components/TheNavbar.vue';
import TheFooter from '../components/TheFooter.vue';
import LegalSection from '../components/LegalSection.vue';

withDefaults(defineProps<{ initial?: 'terms' | 'privacy' }>(), {
  initial: 'terms',
});
</script>

<style scoped>
.legal-view {
  background: var(--color-bg-warm);
}
.legal-view :deep(.q-page) {
  min-height: 0;
}
.legal-view :deep(.q-page-container) {
  padding-bottom: 0 !important;
}
</style>
