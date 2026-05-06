import type { Coupon, LoyaltyAccount } from '@/utils/types';
import { getStore, setStore, delay } from '@/utils/storage';

export async function applyCoupon(
  couponId: string,
  _bookingId: string,
): Promise<Coupon> {
  const accounts = getStore<LoyaltyAccount>('cleanly_loyalty');

  for (const account of accounts) {
    const couponIndex = account.cupones.findIndex((c) => c.id === couponId);
    if (couponIndex === -1) continue;

    const coupon = account.cupones[couponIndex];
    if (!coupon) continue;

    if (coupon.usado) {
      return delay(null as never).then(() => {
        throw new Error('Este cupón ya fue usado');
      });
    }

    const updatedCoupon: Coupon = { ...coupon, usado: true };
    account.cupones[couponIndex] = updatedCoupon;
    setStore('cleanly_loyalty', accounts);

    return delay(updatedCoupon);
  }

  return delay(null as never).then(() => {
    throw new Error('Cupón no encontrado');
  });
}
