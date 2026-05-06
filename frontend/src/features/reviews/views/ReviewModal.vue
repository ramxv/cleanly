<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="review-card">
      <q-card-section>
        <div class="review-card__header">
          <h2 class="review-card__title">Dejar una reseña</h2>
          <q-btn flat round icon="close" v-close-popup @click="$emit('close')" />
        </div>

        <p class="review-card__hint">
          Tu opinión ayuda a otros clientes y mejora la calidad del servicio.
        </p>

        <!-- Estrellas -->
        <div class="stars">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="stars__btn"
            :class="{ 'stars__btn--active': star <= rating }"
            @click="rating = star"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
          >
            {{ (hoverRating || rating) >= star ? '★' : '☆' }}
          </button>
        </div>

        <!-- Comentario -->
        <q-input
          v-model="comentario"
          type="textarea"
          label="Comparte tu experiencia (opcional)"
          outlined
          autogrow
          class="review-card__comment"
        />

        <q-banner v-if="errorMsg" rounded class="review-card__error">
          {{ errorMsg }}
        </q-banner>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat no-caps label="Cancelar" v-close-popup @click="$emit('close')" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Enviar reseña"
          :loading="submitting"
          :disable="rating === 0"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useReviews } from '../composables/useReviews';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';

const props = defineProps<{
  bookingId: string;
  workerId: string;
}>();

const emit = defineEmits<{
  close: [];
  submitted: [];
}>();

const { submitReview } = useReviews();
const { userId } = useAuth();
const { success, error } = useToast();

const visible = ref(true);
const rating = ref(0);
const hoverRating = ref(0);
const comentario = ref('');
const submitting = ref(false);
const errorMsg = ref<string | null>(null);

async function handleSubmit() {
  if (rating.value === 0) return;

  submitting.value = true;
  errorMsg.value = null;

  try {
    await submitReview({
      bookingId: props.bookingId,
      clientId: userId.value!,
      workerId: props.workerId,
      rating: rating.value,
      comentario: comentario.value,
    });
    success('¡Reseña enviada! Gracias por tu feedback.');
    emit('submitted');
  } catch (e: any) {
    errorMsg.value = e.message || 'Error al enviar la reseña';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.review-card {
  width: 100%;
  max-width: 480px;
  border-radius: var(--radius-2xl);
}
.review-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.review-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text);
  margin: 0;
}
.review-card__hint {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.stars {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.stars__btn {
  font-size: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-border-strong);
  transition: color var(--duration-fast), transform var(--duration-fast);
  padding: 0;
  line-height: 1;
}
.stars__btn--active {
  color: var(--color-accent);
}
.stars__btn:hover {
  transform: scale(1.2);
}

.review-card__comment {
  margin-bottom: var(--space-3);
}
.review-card__error {
  background: var(--color-error-bg);
  color: var(--color-error-text);
  font-size: var(--text-sm);
}
</style>
