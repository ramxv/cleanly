// ============================================================
// Cleanly - Composable de notificaciones toast
// ============================================================

import { ref } from 'vue';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 4000) {
    const id = nextId++;
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, duration);
  }

  const success = (msg: string) => show(msg, 'success');
  const error = (msg: string) => show(msg, 'error', 6000);
  const info = (msg: string) => show(msg, 'info');
  const warning = (msg: string) => show(msg, 'warning', 5000);

  return { toasts, success, error, info, warning, show };
}
