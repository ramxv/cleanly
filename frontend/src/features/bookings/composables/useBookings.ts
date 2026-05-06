// ============================================================
// Cleanly - Composable de reservas
// Estado reactivo: bookings, booking, isLoading, error
// ============================================================

import { ref } from 'vue';
import type { Booking, BookingStatus } from '@/utils/types';
import { useAuth } from '@/composables/useAuth';
import { getAllBookings } from '../services/getAll';
import { createBooking as createBookingService } from '../services/create';
import { cancelBooking as cancelBookingService } from '../services/cancel';
import {
  updateBookingStatus as updateBookingStatusService,
} from '../services/updateStatus';

interface CreateBookingDto {
  workerId: string;
  workerName?: string;
  servicio: string;
  zona: string;
  fecha: string;
  horas: number;
  precioHora?: number;
  direccion?: string;
}

export function useBookings() {
  const bookings = ref<Booking[]>([]);
  const booking = ref<Booking | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { userId } = useAuth();

  async function loadBookings(clientId: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      bookings.value = await getAllBookings(clientId);
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar reservas';
    } finally {
      isLoading.value = false;
    }
  }

  async function loadBooking(id: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const allBookings = await getAllBookings(userId.value ?? '');
      booking.value = allBookings.find((b) => b.id === id) ?? null;
      if (!booking.value) throw new Error('Reserva no encontrada');
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al cargar reserva';
    } finally {
      isLoading.value = false;
    }
  }

  async function createBooking(dto: CreateBookingDto): Promise<Booking> {
    isLoading.value = true;
    error.value = null;
    try {
      const booking = await createBookingService({
        clientId: userId.value!,
        ...dto,
      });
      bookings.value.push(booking);
      return booking;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al crear reserva';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelBooking(id: string): Promise<Booking> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await cancelBookingService(id);
      const index = bookings.value.findIndex((b) => b.id === id);
      if (index !== -1) bookings.value[index] = updated;
      if (booking.value?.id === id) booking.value = updated;
      return updated;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Error al cancelar reserva';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<Booking> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await updateBookingStatusService(id, status);
      const index = bookings.value.findIndex((b) => b.id === id);
      if (index !== -1) bookings.value[index] = updated;
      if (booking.value?.id === id) booking.value = updated;
      return updated;
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Error al actualizar estado';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    bookings,
    booking,
    isLoading,
    error,
    loadBookings,
    loadBooking,
    createBooking,
    cancelBooking,
    updateBookingStatus,
  };
}
