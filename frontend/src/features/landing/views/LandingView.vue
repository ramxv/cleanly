<template>
  <q-layout view="hHh Lpr lff" class="landing">
    <TheNavbar />

    <q-page-container>
      <q-page>
        <HeroSection @search="onSearch" />
        <ValueProps />
        <HowItWorksSection />
        <WorkersStrip />
        <PricingSection />
        <HelpSection />
        <ContactSection />
      </q-page>
    </q-page-container>

    <TheFooter />
  </q-layout>
</template>

<script setup lang="ts">
import TheNavbar from '../components/TheNavbar.vue';
import HeroSection from '../components/HeroSection.vue';
import ValueProps from '../components/ValueProps.vue';
import HowItWorksSection from '../components/HowItWorksSection.vue';
import WorkersStrip from '../components/WorkersStrip.vue';
import PricingSection from '../components/PricingSection.vue';
import HelpSection from '../components/HelpSection.vue';
import ContactSection from '../components/ContactSection.vue';
import TheFooter from '../components/TheFooter.vue';

function onSearch(payload: {
  serviceType: string;
  propSize: string;
  date: string;
  neighborhood: string;
}) {
  console.log('search', payload);
}
</script>

<style scoped>
.landing {
  background: var(--color-bg-warm);
}
.landing :deep(.q-page) {
  min-height: 0;
}
.landing :deep(.q-page-container) {
  padding-bottom: 0 !important;
}
</style>
