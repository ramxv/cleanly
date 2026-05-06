<template>
  <div class="toast-container" aria-live="polite">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast--${toast.type}`"
      >
        <q-icon :name="iconForType(toast.type)" size="18px" />
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts } = useToast();

function iconForType(type: string): string {
  const icons: Record<string, string> = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning',
  };
  return icons[type] || 'info';
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  max-width: 420px;
  width: 100%;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--color-white);
  box-shadow: var(--shadow-lg);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  pointer-events: auto;
}

.toast--success {
  border-left: 4px solid var(--color-success);
  color: var(--color-success-text);
}
.toast--error {
  border-left: 4px solid var(--color-error);
  color: var(--color-error-text);
}
.toast--info {
  border-left: 4px solid var(--color-primary);
  color: var(--color-primary-dark);
}
.toast--warning {
  border-left: 4px solid var(--color-warning);
  color: var(--color-warning-text);
}

.toast-message {
  flex: 1;
}

.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
