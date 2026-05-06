import { ref } from 'vue';
import type { LoyaltyAccount, Coupon } from '@/utils/types';
import { getStore, setStore, delay } from '@/utils/storage';
import {
  LOYALTY_SERVICIOS_PARA_CUPON,
  LOYALTY_MAX_DESCUENTO,
} from '@/utils/constants';

export function useLoyalty() {
  const loyaltyAccount = ref<LoyaltyAccount | null>(null);
  const isLoading = ref(false);

  async function loadLoyalty(clientId: string): Promise<void> {
    isLoading.value = true;
    const accounts = getStore<LoyaltyAccount>('cleanly_loyalty');
    const account = accounts.find((a) => a.clientId === clientId);
    loyaltyAccount.value = account ?? null;
    await delay(null);
    isLoading.value = false;
  }

  async function applyCoupon(couponId: string, bookingId: string): Promise<Coupon> {
    isLoading.value = true;

    const { applyCoupon: applyCouponService } = await import(
      '@/features/loyalty/services/applyCoupon'
    );
    const updatedCoupon = await applyCouponService(couponId, bookingId);

    if (loyaltyAccount.value) {
      const idx = loyaltyAccount.value.cupones.findIndex((c) => c.id === couponId);
      if (idx !== -1) {
        loyaltyAccount.value.cupones[idx] = updatedCoupon;
      }
    }

    isLoading.value = false;
    return updatedCoupon;
  }

  async function checkAndGenerateCoupon(clientId: string): Promise<Coupon | null> {
    const accounts = getStore<LoyaltyAccount>('cleanly_loyalty');
    const accountIndex = accounts.findIndex((a) => a.clientId === clientId);

    if (accountIndex === -1) return delay(null);

    const account = accounts[accountIndex];
    if (!account) return delay(null);

    if (account.totalServicios < LOYALTY_SERVICIOS_PARA_CUPON) {
      return delay(null);
    }

    const ciclosMerecidos = Math.floor(account.totalServicios / LOYALTY_SERVICIOS_PARA_CUPON);
    const cuponesActivos = account.cupones.filter((c) => !c.usado).length;

    if (cuponesActivos >= ciclosMerecidos) {
      return delay(null);
    }

    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      clientId,
      codigo: `CLEAN-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      descuento: LOYALTY_MAX_DESCUENTO,
      usado: false,
      expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    accounts[accountIndex]!.cupones.push(newCoupon);
    setStore('cleanly_loyalty', accounts);

    loyaltyAccount.value = accounts[accountIndex]!;

    return delay(newCoupon);
  }

  return {
    loyaltyAccount,
    isLoading,
    loadLoyalty,
    applyCoupon,
    checkAndGenerateCoupon,
  };
}
