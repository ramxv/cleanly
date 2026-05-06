<template>
  <q-layout view="hHh Lpr lff">
    <AppNavbar />
    <q-page-container>
      <q-page class="page">
        <div class="page__header">
          <h1 class="page__title">🎁 Programa de Lealtad</h1>
          <p class="page__subtitle">
            Gana cupones por cada 10 servicios completados
          </p>
        </div>

        <div v-if="isLoading" class="page__loading">
          <q-spinner color="primary" size="3em" />
          <p>Cargando tu progreso...</p>
        </div>

        <div v-else class="loyalty-content">
          <!-- Progreso -->
          <div class="card">
            <h2 class="card__title">Tu progreso</h2>
            <div class="progress">
              <div class="progress__bar-bg">
                <div
                  class="progress__bar-fill"
                  :style="{ width: progressPercent + '%' }"
                />
              </div>
              <div class="progress__stats">
                <span class="progress__count">
                  {{ loyaltyAccount?.totalServicios ?? 0 }} / {{ LOYALTY_SERVICIOS_PARA_CUPON }} servicios
                </span>
                <span class="progress__next">
                  {{ serviciosRestantes === 0 ? '¡Cupón disponible!' : `Faltan ${serviciosRestantes} para tu próximo cupón` }}
                </span>
              </div>
            </div>
          </div>

          <!-- Cupones disponibles -->
          <div class="card">
            <h2 class="card__title">Tus cupones</h2>

            <div v-if="cuponesDisponibles.length === 0" class="card__empty">
              <span class="card__empty-icon">🎫</span>
              <p>Aún no tienes cupones. ¡Completa 10 servicios para ganar uno!</p>
            </div>

            <div v-else class="coupons">
              <div
                v-for="cupon in cuponesDisponibles"
                :key="cupon.id"
                class="coupon"
              >
                <div class="coupon__left">
                  <span class="coupon__amount">B/. {{ cupon.descuento.toFixed(2) }}</span>
                  <span class="coupon__label">de descuento</span>
                </div>
                <div class="coupon__right">
                  <span class="coupon__code">{{ cupon.codigo }}</span>
                  <span class="coupon__expiry">Vence: {{ formatDate(cupon.expiracion) }}</span>
                </div>
              </div>
            </div>

            <!-- Cupones usados -->
            <div v-if="cuponesUsados.length > 0" class="coupons-used">
              <h3 class="card__subtitle">Usados</h3>
              <div
                v-for="cupon in cuponesUsados"
                :key="`used-${cupon.id}`"
                class="coupon coupon--used"
              >
                <div class="coupon__left">
                  <span class="coupon__amount">B/. {{ cupon.descuento.toFixed(2) }}</span>
                </div>
                <div class="coupon__right">
                  <span class="coupon__code">{{ cupon.codigo }}</span>
                  <q-badge color="grey" label="Usado" />
                </div>
              </div>
            </div>
          </div>

          <!-- Cómo funciona -->
          <div class="card">
            <h2 class="card__title">¿Cómo funciona?</h2>
            <div class="steps">
              <div class="step">
                <span class="step__num">1</span>
                <p>Reserva y completa servicios de limpieza</p>
              </div>
              <div class="step__arrow">→</div>
              <div class="step">
                <span class="step__num">2</span>
                <p>Al llegar a 10 servicios, ganas un cupón</p>
              </div>
              <div class="step__arrow">→</div>
              <div class="step">
                <span class="step__num">3</span>
                <p>Úsalo en tu próxima reserva (hasta B/. 50.00)</p>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AppNavbar from '@/components/UI/AppNavbar.vue';
import { useLoyalty } from '../composables/useLoyalty';
import { useAuth } from '@/composables/useAuth';
import { LOYALTY_SERVICIOS_PARA_CUPON } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

const { userId } = useAuth();
const { loyaltyAccount, isLoading, loadLoyalty } = useLoyalty();

onMounted(() => {
  if (userId.value) loadLoyalty(userId.value);
});

const cuponesDisponibles = computed(() =>
  loyaltyAccount.value?.cupones.filter((c) => !c.usado) ?? [],
);

const cuponesUsados = computed(() =>
  loyaltyAccount.value?.cupones.filter((c) => c.usado) ?? [],
);

const serviciosRestantes = computed(() => {
  const total = loyaltyAccount.value?.totalServicios ?? 0;
  const restantes = LOYALTY_SERVICIOS_PARA_CUPON - (total % LOYALTY_SERVICIOS_PARA_CUPON);
  return restantes === LOYALTY_SERVICIOS_PARA_CUPON ? 0 : restantes;
});

const progressPercent = computed(() => {
  const total = loyaltyAccount.value?.totalServicios ?? 0;
  return (total % LOYALTY_SERVICIOS_PARA_CUPON) / LOYALTY_SERVICIOS_PARA_CUPON * 100;
});
</script>

<style scoped>
.page {
  max-width: var(--content-max);
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

.loyalty-content {
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
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--space-4);
}
.card__subtitle {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-secondary);
  margin: var(--space-4) 0 var(--space-2);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
.card__empty {
  text-align: center;
  padding: var(--space-4) 0;
  color: var(--color-text-secondary);
}
.card__empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: var(--space-2);
}

.progress__bar-bg {
  height: 12px;
  border-radius: var(--radius-full);
  background: var(--color-surface-subtle);
  overflow: hidden;
  margin-bottom: var(--space-2);
}
.progress__bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}
.progress__stats {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
}
.progress__count {
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}
.progress__next {
  color: var(--color-accent-text);
  font-weight: var(--weight-medium);
}

.coupons {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.coupon {
  display: flex;
  border: 2px dashed var(--color-accent);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.coupon--used {
  border-color: var(--color-border);
  opacity: 0.6;
}
.coupon__left {
  background: var(--color-accent-light);
  padding: var(--space-4);
  text-align: center;
  min-width: 120px;
}
.coupon__amount {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-accent-dark);
}
.coupon__label {
  font-size: var(--text-xs);
  color: var(--color-accent-text);
}
.coupon__right {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.coupon__code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}
.coupon__expiry {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.steps {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
}
.step__num {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  flex-shrink: 0;
}
.step p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}
.step__arrow {
  color: var(--color-text-tertiary);
  font-size: var(--text-lg);
}
</style>
