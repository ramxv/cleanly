import type { Coupon, LoyaltyAccount } from '@/utils/types';
import { getStore, delay } from '@/utils/storage';

/**
 * Obtiene los cupones de lealtad para un cliente específico.
 * Los cupones viven dentro de la LoyaltyAccount en cleanly_loyalty.
 */
export async function getCoupons(clientId: string): Promise<Coupon[]> {
  const accounts = getStore<LoyaltyAccount>('cleanly_loyalty');
  const account = accounts.find((a) => a.clientId === clientId);
  return delay(account?.cupones ?? []);
}
