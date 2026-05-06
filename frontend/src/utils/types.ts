// ============================================================
// Cleanly - Modelos de datos compartidos
// ============================================================

export type UserRole = 'client' | 'worker' | 'admin';

export type WorkerVerificationStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export type BookingStatus =
  | 'PENDIENTE_PAGO'
  | 'CONFIRMADA'
  | 'EN_PROGRESO'
  | 'COMPLETADA'
  | 'CANCELADA';

export type PaymentStatus = 'PENDIENTE' | 'COMPLETADO' | 'LIBERADO' | 'REEMBOLSADO';

export interface User {
  id: string;
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  rol: UserRole;
  createdAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  nombre: string;
  email: string;
  telefono: string;
  foto?: string;
  bio: string;
  servicios: string[];
  tarifaHora: number;
  zona: string;
  verificationStatus: WorkerVerificationStatus;
  avgRating: number;
  totalReviews: number;
  completedServices: number;
  disponibilidad: TimeSlot[];
  createdAt: string;
}

export interface TimeSlot {
  dayOfWeek: number; // 0=Domingo, 1=Lunes...
  turno: 'manana' | 'tarde';
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  servicio: string;
  zona: string;
  fecha: string; // ISO date
  horas: number;
  tamanoPropiedad: string;
  notas?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  workerId: string;
  workerName: string;
  servicio: string;
  zona: string;
  fecha: string;
  horas: number;
  precioTotal: number;
  precioHora: number;
  comision: number; // 15% de la plataforma
  direccion?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  clientId: string;
  workerId: string;
  montoTotal: number;
  comision: number;
  montoNeto: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  workerId: string;
  rating: number; // 1-5
  comentario: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  clientId: string;
  codigo: string;
  descuento: number; // monto en Balboas
  usado: boolean;
  expiracion: string; // ISO date
  createdAt: string;
}

export interface LoyaltyAccount {
  id: string;
  clientId: string;
  totalServicios: number;
  puntos: number;
  cupones: Coupon[];
}

export interface AdminMetrics {
  totalUsuarios: number;
  totalTrabajadores: number;
  totalReservas: number;
  ingresosPlataforma: number;
  trabajadoresPendientes: number;
  reservasHoy: number;
}
