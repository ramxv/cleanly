<template>
  <q-footer class="footer">
    <div class="footer__top">
      <div class="footer__brand">
        <img src="/logo-white.svg" alt="Cleanly" height="28" />
        <p class="footer__tagline">
          La forma más fácil de mantener tu hogar impecable en Panamá.
        </p>
      </div>

      <div class="footer__cols">
        <div class="footer__col">
          <h4 class="footer__heading">Plataforma</h4>
          <a
            v-for="link in platformLinks"
            :key="link.target"
            href="#"
            class="footer__link"
            @click.prevent="scrollTo(link.target)"
          >
            {{ link.label }}
          </a>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Soporte</h4>
          <a
            v-for="link in supportLinks"
            :key="link.target"
            href="#"
            class="footer__link"
            @click.prevent="scrollTo(link.target)"
          >
            {{ link.label }}
          </a>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Legal</h4>
          <router-link
            v-for="link in legalLinks"
            :key="link.to"
            :to="link.to"
            class="footer__link"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </div>

    <q-separator dark class="footer__separator" />

    <div class="footer__bottom">
      <span class="footer__copy">© 2026 Cleanly · Panamá. Todos los derechos reservados.</span>
      <div class="footer__social">
        <q-btn flat round dense icon="facebook" color="grey-5" aria-label="Facebook" />
        <q-btn flat round dense icon="alternate_email" color="grey-5" aria-label="Email" />
        <q-btn flat round dense icon="chat" color="grey-5" aria-label="WhatsApp" />
      </div>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
const platformLinks = [
  { label: 'Cómo funciona', target: 'como-funciona' },
  { label: 'Trabajadores', target: 'trabajadores' },
  { label: 'Precios', target: 'precios' },
];

const supportLinks = [
  { label: 'Centro de ayuda', target: 'ayuda' },
  { label: 'Contacto', target: 'contacto' },
];

const legalLinks = [
  { label: 'Términos', to: '/terminos' },
  { label: 'Privacidad', to: '/privacidad' },
];

function scrollTo(id: string) {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<style scoped>
.footer {
  background: var(--color-bg-dark);
  color: var(--color-text-tertiary);
  padding: var(--space-16) var(--space-8) var(--space-8);
  position: relative;
}
.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
}
.footer__top {
  max-width: var(--content-max);
  margin: 0 auto var(--space-10);
  display: grid;
  grid-template-columns: 1.4fr 2fr;
  gap: var(--space-12);
}
.footer__brand img {
  margin-bottom: var(--space-4);
}
.footer__tagline {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  max-width: 340px;
}
.footer__cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}
.footer__heading {
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-caps);
  color: var(--color-white);
  margin-bottom: var(--space-4);
}
.footer__link {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: 6px 0;
  cursor: pointer;
  transition: color var(--duration-fast);
}
.footer__link:hover {
  color: var(--color-accent);
}
.footer__separator {
  max-width: var(--content-max);
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
}
.footer__bottom {
  max-width: var(--content-max);
  margin: var(--space-6) auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}
.footer__copy {
  font-size: var(--text-xs);
  color: #475569;
}
.footer__social {
  display: flex;
  gap: var(--space-1);
}

@media (max-width: 900px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  .footer__cols {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
