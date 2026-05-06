// ============================================================
// Cleanly - Composable de pagos
// Estado reactivo: payments, isLoading
// ============================================================

import { ref } from 'vue';
import type { Payment } from '@/utils/types';
import { getPaymentHistory } from '../services/getHistory';
import { processPayment as processPaymentService } from '../services/processPayment';

interface ProcessPaymentDto {
  bookingId: string;
  clientId: string;
  workerId: string;
  montoTotal: number;
}

export function usePayments() {
  const payments = ref<Payment[]>([]);
  const isLoading = ref(false);

  async function loadHistory(clientId: string): Promise<void> {
    isLoading.value = true;
    try {
      payments.value = await getPaymentHistory(clientId);
    } finally {
      isLoading.value = false;
    }
  }

  async function processPayment(dto: ProcessPaymentDto): Promise<Payment> {
    isLoading.value = true;
    try {
      const payment = await processPaymentService(dto);
      payments.value.push(payment);
      return payment;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    payments,
    isLoading,
    loadHistory,
    processPayment,
  };
}
