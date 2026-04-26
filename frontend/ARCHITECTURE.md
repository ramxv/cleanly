# 🎨 Cleanly Frontend — Guía Completa de Arquitectura

Bienvenido al frontend de **Cleanly**. Este documento está escrito para desarrolladores que nunca han visto conceptos como Screaming Architecture, Feature-Driven Development, Composition API o Composables. No se asume ningún conocimiento previo sobre estas ideas. Al terminar de leer, entenderás *por qué* cada carpeta y archivo existe y cómo se comunican entre sí.

---

## Tabla de Contenidos

1. [El problema que resolvemos](#1-el-problema-que-resolvemos)
2. [Screaming Architecture — "¿de qué trata este proyecto?"](#2-screaming-architecture--de-qué-trata-este-proyecto)
3. [Tecnologías principales](#3-tecnologías-principales)
4. [Estructura real de directorios](#4-estructura-real-de-directorios)
5. [Las capas de un Feature](#5-las-capas-de-un-feature)
6. [Composables — la pieza clave de Vue 3](#6-composables--la-pieza-clave-de-vue-3)
7. [Casos de uso reales paso a paso](#7-casos-de-uso-reales-paso-a-paso)
8. [El cliente HTTP (Axios)](#8-el-cliente-http-axios)
9. [El router y las rutas](#9-el-router-y-las-rutas)
10. [Componentes de UI compartidos](#10-componentes-de-ui-compartidos)
11. [Utilities y formatters](#11-utilities-y-formatters)
12. [Flujo completo de una petición](#12-flujo-completo-de-una-petición)

---

## 1. El problema que resolvemos

Imagina un proyecto Vue típico y antiguo. Cuando tienes 50 pantallas y 200 componentes, la estructura se ve así:

```text
❌ Estructura tradicional (el caos)
src/
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── WorkerListView.vue
│   ├── WorkerDetailView.vue
│   ├── BookingListView.vue
│   ├── BookingDetailView.vue
│   ├── PaymentHistoryView.vue
│   └── ... 40 archivos más
├── components/
│   ├── LoginForm.vue
│   ├── WorkerCard.vue
│   ├── BookingTimeline.vue
│   ├── StarRating.vue
│   └── ... 150 componentes mezclados
└── services/
    ├── api.ts          ← todas las peticiones HTTP juntas (1000 líneas)
    └── auth.ts
```

**¿El problema?**

Cuando necesitas trabajar en la funcionalidad de *Bookings*, tienes que saltar entre `views/`, `components/` y `services/` constantemente, buscando qué pertenece a qué. Si dos personas trabajan simultáneamente —una en Bookings y otra en Workers— constantemente editan los mismos archivos y generan conflictos en Git.

**La solución de Cleanly:**

Agrupamos el código **verticalmente por funcionalidad**, no horizontalmente por tipo de archivo.

```text
✅ Estructura Feature-Driven (lo que tenemos)
src/features/bookings/   ← TODO lo de bookings está aquí
src/features/workers/    ← TODO lo de workers está aquí
src/features/auth/       ← TODO lo de auth está aquí
```

Al abrir la carpeta `features/`, el proyecto "grita" (*screams*) de qué trata: Cleanly es un sistema de **auth**, **bookings**, **workers**, **payments**, **reviews** y **loyalty**. Eso es la Screaming Architecture.

---

## 2. Screaming Architecture — "¿de qué trata este proyecto?"

El término fue acuñado por Robert C. Martin (Uncle Bob). La idea central es:

> "La arquitectura de una aplicación debe comunicar las intenciones del sistema, no los detalles de implementación."

Cuando entras al código de Cleanly y ves:

```
features/
├── auth/
├── bookings/
├── loyalty/
├── payments/
├── reviews/
├── service-requests/
└── workers/
```

Inmediatamente sabes que estás en una plataforma de servicios de limpieza con reservas, pagos, reseñas y fidelización. El código te dice **qué** hace el sistema, no **cómo** está hecho (con Vue, con Axios, etc.).

**Comparación:**

| Tradicional (por tipo)          | Feature-Driven (Cleanly)              |
|---------------------------------|---------------------------------------|
| Gritas: "tengo Views, Components, Services" | Gritas: "soy Auth, Bookings, Workers" |
| Para tocar Bookings: 3 carpetas | Para tocar Bookings: 1 carpeta        |
| Merge conflicts constantes       | Equipos trabajan en carpetas distintas |
| Difícil de eliminar una feature  | Borrar `features/loyalty/` y listo    |

---

## 3. Tecnologías principales

### Vue 3 con Composition API y `<script setup>`

Vue 3 introdujo una nueva forma de escribir componentes llamada **Composition API**. La diferencia con la antigua **Options API** es enorme:

```vue
<!-- ❌ Options API (Vue 2, difícil de reutilizar lógica) -->
<script>
export default {
  data() {
    return { isLoading: false, workers: [] }
  },
  methods: {
    async loadWorkers() {
      this.isLoading = true
      this.workers = await fetchWorkers()
      this.isLoading = false
    }
  },
  mounted() {
    this.loadWorkers()
  }
}
</script>
```

```vue
<!-- ✅ Composition API con <script setup> (Vue 3, como en Cleanly) -->
<script setup lang="ts">
import { useWorkers } from '../composables/useWorkers'

const { workers, isLoading, loadWorkers } = useWorkers()
// La lógica está en un Composable reutilizable, no atrapada en el componente
</script>
```

La diferencia clave: con Composition API, extraes la lógica a **Composables** (funciones reutilizables), lo que permite compartir la misma lógica entre múltiples componentes sin duplicar código.

### TypeScript Estricto

TypeScript es un superset de JavaScript que agrega tipos. Evita errores como:

```typescript
// Sin TypeScript (JavaScript puro — el error aparece en producción)
const worker = null;
console.log(worker.name);  // 💥 TypeError en producción

// Con TypeScript (el error aparece en tu editor, antes de ejecutar)
const worker: WorkerProfileEntity | null = null;
console.log(worker.name);  // ❌ Error de compilación: worker puede ser null
```

En Cleanly, los tipos del frontend están sincronizados conceptualmente con los DTOs y entidades del backend NestJS. Esto significa que si el backend cambia qué devuelve un endpoint, TypeScript te avisará en el frontend qué hay que actualizar.

### Vite

Vite es el bundler (empaquetador) que convierte tu código Vue + TypeScript en JavaScript que entiende el navegador. Su principal ventaja: **es extremadamente rápido**. Cuando guardas un archivo, el cambio aparece en el navegador en menos de 100ms.

### TailwindCSS (estilos)

Utility-first CSS framework. En lugar de escribir CSS personalizado, usas clases predefinidas directamente en el template:

```vue
<!-- Sin Tailwind: necesitas crear un archivo CSS separado -->
<button class="mi-boton-primario">Guardar</button>

<!-- Con Tailwind: las clases describen el estilo directamente -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Guardar
</button>
```

---

## 4. Estructura real de directorios

Este es el árbol exacto del proyecto tal como existe en el repositorio:

```text
frontend/src/
│
├── App.vue                          # Componente raíz — solo tiene <RouterView />
├── main.ts                          # Punto de entrada — monta Vue, registra plugins
│
├── api/
│   └── axios.ts                     # Instancia Axios configurada con interceptores JWT
│
├── components/
│   └── UI/                          # Componentes visuales reutilizables (sin lógica de negocio)
│       ├── AppButton.vue            # Botón con variantes: primary, secondary, danger
│       ├── AppInput.vue             # Input con label, error state y validación visual
│       ├── AppModal.vue             # Modal genérico con slots para header/body/footer
│       └── AppTable.vue             # Tabla con paginación y columnas configurables
│
├── composables/                     # Composables compartidos entre features
│   ├── useAuth.ts                   # Estado global de autenticación (user, token, logout)
│   ├── useCrud.ts                   # Composable genérico: isLoading, error, data para fetching
│   └── useToast.ts                  # Notificaciones toast (éxito, error, info)
│
├── features/                        # El corazón de la aplicación — módulos de negocio
│   │
│   ├── admin/                       # Panel de administración
│   │   ├── index.ts                 # Re-exporta componentes y composables del módulo
│   │   ├── components/
│   │   │   ├── DisputePanel.vue     # Panel para gestionar disputas entre cliente y trabajador
│   │   │   └── MetricCard.vue       # Tarjeta visual de métricas (bookings hoy, ingresos, etc.)
│   │   ├── composables/
│   │   │   └── useAdmin.ts          # Estado y acciones del admin: métricas, verificaciones
│   │   ├── services/
│   │   │   ├── getMetrics.ts        # GET /admin/metrics
│   │   │   ├── resolveDispute.ts    # POST /admin/disputes/:id/resolve
│   │   │   └── verifyWorker.ts      # PATCH /admin/workers/:id/verify
│   │   └── views/
│   │       ├── AdminDashboardView.vue     # Dashboard principal del admin
│   │       ├── DisputeView.vue            # Lista y gestión de disputas
│   │       └── WorkerVerificationView.vue # Lista de trabajadores pendientes de verificar
│   │
│   ├── auth/                        # Autenticación de usuarios
│   │   ├── index.ts
│   │   ├── composables/
│   │   │   └── useAuth.ts           # login(), register(), logout(), currentUser
│   │   ├── services/
│   │   │   ├── login.ts             # POST /auth/login
│   │   │   ├── refreshToken.ts      # POST /auth/refresh
│   │   │   └── register.ts          # POST /auth/register
│   │   └── views/
│   │       ├── LoginView.vue        # Pantalla de inicio de sesión
│   │       └── RegisterView.vue     # Pantalla de registro (cliente o trabajador)
│   │
│   ├── bookings/                    # Reservas de servicio de limpieza
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── BookingStatusBadge.vue  # Badge de color según estado: PENDING, PAID, DONE
│   │   │   └── BookingTimeline.vue     # Línea de tiempo visual del progreso del booking
│   │   ├── composables/
│   │   │   └── useBookings.ts       # bookings, createBooking(), cancelBooking(), etc.
│   │   ├── modules/
│   │   │   └── bookings.ts          # Tipos y constantes locales del módulo
│   │   ├── services/
│   │   │   ├── cancel.ts            # PATCH /bookings/:id/cancel
│   │   │   ├── create.ts            # POST /bookings
│   │   │   ├── getAll.ts            # GET /bookings (lista de mis reservas)
│   │   │   └── updateStatus.ts      # PATCH /bookings/:id/status (para trabajadores)
│   │   └── views/
│   │       ├── BookingDetailView.vue   # Detalle de una reserva específica
│   │       └── BookingListView.vue     # Lista de todas mis reservas
│   │
│   ├── loyalty/                     # Sistema de puntos y cupones de fidelización
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── CouponCard.vue       # Tarjeta visual de un cupón con descuento
│   │   │   └── LoyaltyProgress.vue  # Barra de progreso hacia el siguiente nivel
│   │   ├── composables/
│   │   │   └── useLoyalty.ts        # coupons, points, applyCoupon(), redeemPoints()
│   │   ├── services/
│   │   │   ├── applyCoupon.ts       # POST /loyalty/apply
│   │   │   └── getCoupons.ts        # GET /loyalty/coupons
│   │   └── views/
│   │       └── LoyaltyView.vue      # Pantalla de mis puntos y cupones disponibles
│   │
│   ├── payments/                    # Historial y procesamiento de pagos
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── PaymentReceiptModal.vue   # Modal con comprobante de pago descargable
│   │   │   └── PaymentSummaryCard.vue    # Tarjeta resumen: monto, método, estado
│   │   ├── composables/
│   │   │   └── usePayments.ts       # payments, processPayment(), getHistory()
│   │   ├── modules/
│   │   │   └── payments.ts
│   │   ├── services/
│   │   │   ├── getHistory.ts        # GET /payments/history
│   │   │   └── processPayment.ts    # POST /payments/process
│   │   └── views/
│   │       └── PaymentHistoryView.vue   # Historial de todos mis pagos
│   │
│   ├── reviews/                     # Reseñas y calificaciones post-servicio
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── ReviewCard.vue       # Tarjeta con avatar, estrellas y comentario
│   │   │   └── StarRating.vue       # Selector interactivo de 1 a 5 estrellas
│   │   ├── composables/
│   │   │   └── useReviews.ts        # reviews, createReview(), getWorkerReviews()
│   │   ├── services/
│   │   │   ├── createReview.ts      # POST /reviews
│   │   │   └── getByWorker.ts       # GET /reviews/worker/:id
│   │   └── views/
│   │       └── ReviewView.vue       # Pantalla para dejar y ver reseñas
│   │
│   ├── service-requests/            # Búsqueda de trabajadores antes de hacer un booking
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── RequestForm.vue      # Formulario: zona, fecha, tipo de servicio
│   │   │   └── WorkerMatchCard.vue  # Tarjeta de resultado de búsqueda con botón "Reservar"
│   │   ├── composables/
│   │   │   └── useServiceRequests.ts  # matches, searchWorkers(), selectWorker()
│   │   ├── modules/
│   │   │   └── serviceRequests.ts
│   │   ├── services/
│   │   │   ├── create.ts            # POST /service-requests/search
│   │   │   └── getMatches.ts        # GET /service-requests/:id/matches
│   │   └── views/
│   │       ├── CreateRequestView.vue    # Formulario de búsqueda de trabajadores
│   │       └── RequestResultsView.vue   # Lista de trabajadores que hacen match
│   │
│   └── workers/                     # Perfiles y gestión de trabajadores
│       ├── index.ts
│       ├── components/
│       │   ├── WorkerAvailabilityForm.vue  # Formulario para que el trabajador marque su horario
│       │   └── WorkerCard.vue              # Tarjeta de trabajador: foto, rating, precio/hora
│       ├── composables/
│       │   └── useWorkers.ts        # worker, updateAvailability(), uploadDocuments()
│       ├── modules/
│       │   └── workers.ts
│       ├── services/
│       │   ├── getAll.ts            # GET /workers (lista pública)
│       │   ├── getById.ts           # GET /workers/:id
│       │   ├── updateProfile.ts     # PATCH /workers/profile
│       │   └── uploadDocuments.ts   # POST /workers/documents (multipart)
│       └── views/
│           ├── WorkerDetailView.vue      # Perfil público de un trabajador
│           ├── WorkerListView.vue        # Lista/búsqueda de trabajadores
│           └── WorkerOnboardingView.vue  # Registro y configuración inicial del trabajador
│
├── router/
│   ├── index.ts                     # Crea el router, aplica navigation guards globales
│   └── routes.ts                    # Define todas las rutas: path, component, meta (roles)
│
├── styles/
│   ├── input.css                    # Directivas de TailwindCSS (@tailwind base, components, utilities)
│   └── main.css                     # Variables CSS globales, fuentes, reseteos
│
└── utils/
    ├── formatters.ts                # formatDate(), formatCurrency(), formatPhoneNumber()
    └── validators.ts                # isValidEmail(), isValidRUT(), isStrongPassword()
```

---

## 5. Las capas de un Feature

Cada carpeta dentro de `features/` sigue la misma estructura interna. Tomemos `bookings/` como ejemplo y expliquemos qué hace cada capa:

### `/views/` — Las pantallas completas

Son los componentes que Vue Router monta directamente. Una view es una **pantalla completa** asociada a una URL.

```vue
<!-- features/bookings/views/BookingListView.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Mis Reservas</h1>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="text-center py-12">
      Cargando reservas...
    </div>

    <!-- Lista de bookings -->
    <div v-else class="space-y-4">
      <div v-for="booking in bookings" :key="booking.id">
        <!-- Componente específico de este feature -->
        <BookingStatusBadge :status="booking.status" />
        <p>{{ booking.workerName }} — {{ formatDate(booking.scheduledDate) }}</p>
        <RouterLink :to="`/bookings/${booking.id}`">Ver detalle</RouterLink>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="!isLoading && bookings.length === 0">
      No tienes reservas aún.
      <RouterLink to="/service-requests/new">Buscar trabajadores</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBookings } from '../composables/useBookings'
import { formatDate } from '@/utils/formatters'
import BookingStatusBadge from '../components/BookingStatusBadge.vue'

// La view delega TODO a un Composable. No tiene lógica propia.
const { bookings, isLoading, loadBookings } = useBookings()

onMounted(() => loadBookings())
</script>
```

**Regla:** Las views no hacen peticiones HTTP directamente. Consumen Composables.

### `/composables/` — La lógica de negocio del feature

Un Composable es una función de TypeScript que usa la Composition API de Vue para manejar **estado reactivo** y **lógica de negocio**. Es la pieza más importante de la arquitectura.

```typescript
// features/bookings/composables/useBookings.ts
import { ref } from 'vue'
import { getAllBookings, createBooking, cancelBooking } from '../services/getAll'
import type { BookingEntity } from '../modules/bookings'

export function useBookings() {
  // Estado reactivo — cuando cambia, Vue re-renderiza automáticamente
  const bookings = ref<BookingEntity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadBookings() {
    isLoading.value = true
    error.value = null
    try {
      bookings.value = await getAllBookings()  // delega al servicio
    } catch (e) {
      error.value = 'No se pudieron cargar las reservas'
    } finally {
      isLoading.value = false
    }
  }

  async function cancelBookingById(id: string, reason: string) {
    await cancelBooking(id, reason)  // delega al servicio
    // Actualiza el estado local sin recargar todo
    const booking = bookings.value.find(b => b.id === id)
    if (booking) booking.status = 'CANCELLED'
  }

  // Expone estado y acciones al componente que lo use
  return { bookings, isLoading, error, loadBookings, cancelBookingById }
}
```

**¿Por qué extraer lógica a un Composable?** Porque la misma lógica puede necesitarse en múltiples views:

```typescript
// BookingListView.vue
const { bookings, loadBookings } = useBookings()

// WorkerDashboardView.vue (también necesita ver bookings del trabajador)
const { bookings, loadBookings } = useBookings()  // reutiliza el mismo composable
```

### `/services/` — Las peticiones HTTP (puras)

Los services son funciones simples que hacen una única petición HTTP. No tienen estado, no manejan loading, solo hacen la llamada y devuelven los datos.

```typescript
// features/bookings/services/getAll.ts
import { api } from '@/api/axios'
import type { BookingEntity } from '../modules/bookings'

export async function getAllBookings(): Promise<BookingEntity[]> {
  const { data } = await api.get<BookingEntity[]>('/bookings')
  return data
}

// features/bookings/services/cancel.ts
export async function cancelBooking(id: string, reason: string): Promise<void> {
  await api.patch(`/bookings/${id}/cancel`, { reason })
}

// features/bookings/services/create.ts
import type { CreateBookingDto } from '../modules/bookings'

export async function createBooking(dto: CreateBookingDto): Promise<BookingEntity> {
  const { data } = await api.post<BookingEntity>('/bookings', dto)
  return data
}
```

**Regla:** Un archivo de service = una llamada HTTP. Nombres descriptivos: `getAll.ts`, `create.ts`, `cancel.ts`.

### `/components/` — Componentes visuales del feature

Son componentes Vue que solo tienen sentido dentro de ese feature. No son reutilizables en toda la app (esos van en `components/UI/`).

```vue
<!-- features/bookings/components/BookingStatusBadge.vue -->
<template>
  <span :class="badgeClass">{{ statusLabel }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'PENDING' | 'ACCEPTED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}>()

// Mapea el status técnico a una etiqueta visual amigable
const statusLabel = computed(() => ({
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptado',
  PAID: 'Pagado',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}[props.status]))

// Mapea el status a colores de TailwindCSS
const badgeClass = computed(() => ({
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
}[props.status] + ' px-2 py-1 rounded-full text-sm font-medium'))
</script>
```

### `/modules/` — Tipos y constantes del feature

Archivo TypeScript con las interfaces y tipos que usa ese feature. Piensa en él como el "vocabulario" del módulo.

```typescript
// features/bookings/modules/bookings.ts
export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export interface BookingEntity {
  id: string
  clientId: string
  workerId: string
  workerName: string
  serviceType: string
  scheduledDate: string  // ISO 8601
  hours: number
  totalPrice: number
  status: BookingStatus
  createdAt: string
}

export interface CreateBookingDto {
  workerId: string
  scheduledDate: string
  hours: number
  serviceType: string
  zone: string
  couponCode?: string   // opcional
}
```

### `index.ts` — El barril del módulo

Centralizamos las exportaciones para importar más limpio:

```typescript
// features/bookings/index.ts
export { useBookings } from './composables/useBookings'
export { BookingStatusBadge } from './components/BookingStatusBadge.vue'
export type { BookingEntity, CreateBookingDto } from './modules/bookings'

// Ahora en otras partes del código puedes importar así:
// import { useBookings, BookingStatusBadge } from '@/features/bookings'
// En lugar de:
// import { useBookings } from '@/features/bookings/composables/useBookings'
// import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge.vue'
```

---

## 6. Composables — la pieza clave de Vue 3

Los Composables merecen una sección propia porque son el concepto más importante y más diferente respecto a Vue 2.

### ¿Qué problema resuelven?

En Vue 2 con Options API, la lógica estaba **atrapada** dentro de cada componente. Si dos componentes necesitaban la misma lógica, tenías que copiarla.

```javascript
// ❌ Vue 2 — duplicación inevitable
// Componente A
export default {
  data() { return { isLoading: false, user: null } },
  methods: {
    async loadUser() {
      this.isLoading = true
      this.user = await fetchUser()
      this.isLoading = false
    }
  }
}

// Componente B — misma lógica, copiada
export default {
  data() { return { isLoading: false, user: null } },
  methods: {
    async loadUser() { /* ... copia exacta ... */ }
  }
}
```

Con Composables, la lógica se extrae a una función y se reutiliza:

```typescript
// ✅ Vue 3 — extraída a un Composable
// composables/useAuth.ts
export function useAuth() {
  const user = ref<UserEntity | null>(null)
  const isLoading = ref(false)

  async function loadCurrentUser() {
    isLoading.value = true
    user.value = await fetchCurrentUser()
    isLoading.value = false
  }

  return { user, isLoading, loadCurrentUser }
}

// Componente A — usa el composable
const { user, isLoading } = useAuth()

// Componente B — misma lógica, cero duplicación
const { user } = useAuth()
```

### Composable global: `useAuth`

Este es el Composable más importante de toda la app. Maneja la identidad del usuario en toda la aplicación:

```typescript
// src/composables/useAuth.ts
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginService, register as registerService } from '@/features/auth/services/login'
import type { UserEntity } from '@/features/auth/modules/auth'

// Estado FUERA de la función — se comparte entre TODAS las instancias
// Esto es lo que hace que sea "global" sin necesitar Pinia o Vuex
const currentUser = ref<UserEntity | null>(null)
const accessToken = ref<string | null>(localStorage.getItem('token'))

export function useAuth() {
  const router = useRouter()

  // Computed: se recalcula automáticamente cuando currentUser cambia
  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => currentUser.value?.role === 'ADMIN')
  const isWorker = computed(() => currentUser.value?.role === 'WORKER')
  const isClient = computed(() => currentUser.value?.role === 'CLIENT')

  async function login(email: string, password: string) {
    const response = await loginService({ email, password })

    // Persiste el token en localStorage Y en memoria reactiva
    accessToken.value = response.accessToken
    currentUser.value = response.user
    localStorage.setItem('token', response.accessToken)

    // Redirige según el rol
    if (isAdmin.value) router.push('/admin/dashboard')
    else if (isWorker.value) router.push('/worker/dashboard')
    else router.push('/bookings')
  }

  function logout() {
    currentUser.value = null
    accessToken.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return {
    currentUser,
    accessToken,
    isAuthenticated,
    isAdmin,
    isWorker,
    isClient,
    login,
    logout,
  }
}
```

### Composable genérico: `useCrud`

Para operaciones CRUD repetitivas (cargar, crear, actualizar, eliminar), tenemos un Composable genérico que evita repetir el mismo patrón de loading/error:

```typescript
// src/composables/useCrud.ts
import { ref } from 'vue'

export function useCrud<T>(fetchFn: () => Promise<T[]>) {
  const items = ref<T[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      items.value = await fetchFn()
    } catch (e: any) {
      error.value = e.message ?? 'Error desconocido'
    } finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, error, load }
}

// Uso en un composable específico:
// const { items: workers, isLoading, load: loadWorkers } = useCrud(getAllWorkers)
```

### Composable: `useToast`

Notificaciones reutilizables en toda la app:

```typescript
// src/composables/useToast.ts
import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, type: ToastType = 'info') {
    const id = nextId++
    toasts.value.push({ id, message, type })

    // Auto-elimina después de 4 segundos
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 4000)
  }

  const success = (msg: string) => show(msg, 'success')
  const error = (msg: string) => show(msg, 'error')
  const info = (msg: string) => show(msg, 'info')

  return { toasts, success, error, info }
}

// Uso en cualquier componente o composable:
// const { success, error } = useToast()
// success('Reserva creada exitosamente')
// error('No se pudo procesar el pago')
```

---

## 7. Casos de uso reales paso a paso

### Caso 1: Un cliente inicia sesión

```
1. Usuario entra a /login → Vue Router monta LoginView.vue
        ↓
2. LoginView.vue
   - Tiene un formulario con campos email y password
   - Al hacer submit llama a: const { login } = useAuth()  →  login(email, password)
        ↓
3. useAuth.ts (composable)
   - Pone isLoading.value = true (el botón muestra spinner)
   - Llama al servicio: await loginService({ email, password })
        ↓
4. features/auth/services/login.ts
   - Hace: api.post('/auth/login', { email, password })
   - api es la instancia Axios con baseURL y interceptores
        ↓
5. El backend NestJS responde: { accessToken: "eyJ...", user: { id, name, role } }
        ↓
6. useAuth.ts
   - Guarda el token: localStorage.setItem('token', response.accessToken)
   - Actualiza el estado: currentUser.value = response.user
   - Redirige: router.push('/bookings') (si es cliente)
        ↓
7. isLoading.value = false → el spinner desaparece
8. Como currentUser.value cambió, todos los componentes
   que usan useAuth() se actualizan automáticamente (navbar, avatar, etc.)
```

### Caso 2: Un cliente busca trabajadores disponibles

```
1. Usuario llega a /service-requests/new → CreateRequestView.vue
        ↓
2. RequestForm.vue recolecta: zona, fecha, tipo de servicio
   - Al enviar: const { searchWorkers } = useServiceRequests()
   - Llama: searchWorkers({ zone: 'Miraflores', date: '2024-12-15', serviceType: 'DEEP_CLEAN' })
        ↓
3. useServiceRequests.ts
   - isLoading.value = true
   - Llama al servicio: await createRequest(dto)
        ↓
4. features/service-requests/services/create.ts
   - api.post('/service-requests/search', dto)
   - El backend ejecuta el algoritmo de matching
   - Devuelve: WorkerProfileEntity[] (los mejores matches)
        ↓
5. useServiceRequests.ts
   - matches.value = response  (array de trabajadores)
   - isLoading.value = false
   - router.push('/service-requests/results')
        ↓
6. RequestResultsView.vue
   - Itera matches con v-for
   - Muestra WorkerMatchCard.vue por cada trabajador
   - El usuario hace click en "Reservar" → navega a /bookings/create?workerId=...
```

### Caso 3: Un trabajador actualiza su disponibilidad

```
1. Trabajador en /worker/availability → WorkerOnboardingView.vue
        ↓
2. WorkerAvailabilityForm.vue
   - Permite seleccionar franjas horarias en un calendario
   - Al guardar: const { updateAvailability } = useWorkers()
   - Llama: updateAvailability(selectedSlots)
        ↓
3. useWorkers.ts
   - isSaving.value = true
   - Llama al servicio: await updateProfile(slots)
        ↓
4. features/workers/services/updateProfile.ts
   - api.patch('/workers/availability', { slots })
   - El interceptor de Axios adjunta automáticamente el token JWT en el header
        ↓
5. El backend NestJS:
   - JwtAuthGuard verifica el token
   - RolesGuard verifica que tenga rol WORKER
   - WorkersService actualiza los slots en PostgreSQL
   - Responde: 200 OK
        ↓
6. useWorkers.ts
   - isSaving.value = false
   - const { success } = useToast()
   - success('Disponibilidad actualizada correctamente')
        ↓
7. El toast aparece en pantalla durante 4 segundos y desaparece
```

### Caso 4: El admin verifica a un trabajador

```
1. Admin en /admin/workers → WorkerVerificationView.vue
   - Lista todos los trabajadores pendientes de verificación
        ↓
2. useAdmin.ts carga la lista con: await getWorkersPendingVerification()
        ↓
3. Admin hace click en "Verificar" en DisputePanel.vue
   - Llama: const { verifyWorker } = useAdmin()
   - verifyWorker(workerId, { approved: true, notes: 'Documentos en orden' })
        ↓
4. features/admin/services/verifyWorker.ts
   - api.patch(`/admin/workers/${workerId}/verify`, dto)
        ↓
5. Backend verifica, actualiza isVerified: true en la DB
   y envía email al trabajador diciendo que puede empezar a recibir reservas
        ↓
6. useAdmin.ts actualiza la lista local eliminando al trabajador verificado
   - La UI reacciona automáticamente (la tarjeta desaparece de la lista pendiente)
```

---

## 8. El cliente HTTP (Axios)

Toda comunicación con el backend pasa por un único punto: la instancia Axios configurada en `src/api/axios.ts`.

```typescript
// src/api/axios.ts
import axios from 'axios'

// Instancia configurada para este proyecto
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // ej: http://localhost:3000
  timeout: 10_000,                         // 10 segundos máximo de espera
  headers: {
    'Content-Type': 'application/json',
  },
})

// INTERCEPTOR DE REQUEST: se ejecuta ANTES de cada petición
// Adjunta el JWT automáticamente a todos los requests autenticados
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    // El header queda: Authorization: Bearer eyJ0eXAiOiJKV1QiLC...
  }
  return config
})

// INTERCEPTOR DE RESPONSE: se ejecuta DESPUÉS de cada respuesta
api.interceptors.response.use(
  // Respuestas exitosas: las deja pasar sin modificar
  (response) => response,

  // Errores HTTP:
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      window.location.href = '/login'  // fuerza logout
    }

    if (error.response?.status === 403) {
      // Token válido pero sin permisos suficientes
      window.location.href = '/unauthorized'
    }

    // Para cualquier otro error, rechaza la promesa para que
    // el try/catch del composable lo capture
    return Promise.reject(error)
  }
)
```

**¿Por qué centralizar en un solo cliente?**

- Si mañana cambia la URL del backend, cambias `VITE_API_URL` en `.env`, no 50 archivos.
- Si el token expira, el interceptor lo maneja una sola vez, no en cada service.
- Si necesitas agregar un header personalizado (X-App-Version, X-Request-ID), lo agregas una vez.

---

## 9. El router y las rutas

### `router/routes.ts` — Definición de rutas

```typescript
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  // Rutas públicas (sin autenticación)
  {
    path: '/login',
    component: () => import('@/features/auth/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    component: () => import('@/features/auth/views/RegisterView.vue'),
    meta: { requiresAuth: false },
  },

  // Rutas privadas para clientes
  {
    path: '/bookings',
    component: () => import('@/features/bookings/views/BookingListView.vue'),
    meta: { requiresAuth: true, roles: ['CLIENT'] },
  },
  {
    path: '/bookings/:id',
    component: () => import('@/features/bookings/views/BookingDetailView.vue'),
    meta: { requiresAuth: true, roles: ['CLIENT'] },
  },

  // Rutas privadas para trabajadores
  {
    path: '/worker/onboarding',
    component: () => import('@/features/workers/views/WorkerOnboardingView.vue'),
    meta: { requiresAuth: true, roles: ['WORKER'] },
  },

  // Rutas exclusivas para admins
  {
    path: '/admin/dashboard',
    component: () => import('@/features/admin/views/AdminDashboardView.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
]
```

### `router/index.ts` — Navigation Guards

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard Global — se ejecuta ANTES de cada cambio de ruta
router.beforeEach((to, _from) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  // Si la ruta requiere auth y no hay token → redirige a login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // Si está logueado e intenta ir a /login → redirige a su dashboard
  if (!to.meta.requiresAuth && isAuthenticated) {
    return { path: '/bookings' }
  }

  // Verificación de roles: si la ruta requiere rol específico
  if (to.meta.roles && token) {
    const payload = JSON.parse(atob(token.split('.')[1]))  // decode JWT
    if (!to.meta.roles.includes(payload.role)) {
      return { path: '/unauthorized' }
    }
  }
})

export default router
```

**¿Por qué lazy loading?** Nota el `() => import(...)` en las rutas. Esto significa que el código de `BookingListView.vue` NO se descarga cuando el usuario entra a la app. Solo se descarga cuando el usuario navega a `/bookings`. Esto hace que la carga inicial de la app sea mucho más rápida.

---

## 10. Componentes de UI compartidos

En `src/components/UI/` viven los componentes que son completamente genéricos. No saben nada de Cleanly, solo son bloques visuales reutilizables.

### AppButton.vue

```vue
<!-- src/components/UI/AppButton.vue -->
<template>
  <button
    :class="[baseClass, variantClass, sizeClass]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="animate-spin mr-2">⏳</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
})

defineEmits(['click'])

const baseClass = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2'

const variantClass = computed(() => ({
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
}[props.variant]))

const sizeClass = computed(() => ({
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}[props.size]))
</script>
```

**Uso en cualquier feature:**

```vue
<AppButton variant="primary" :loading="isLoading" @click="createBooking">
  Confirmar Reserva
</AppButton>

<AppButton variant="danger" size="sm" @click="cancelBooking">
  Cancelar
</AppButton>
```

### AppInput.vue

```vue
<!-- src/components/UI/AppInput.vue -->
<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['border rounded-lg px-3 py-2', error ? 'border-red-500' : 'border-gray-300']"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Mensaje de error debajo del input -->
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
  id?: string
}>()

defineEmits(['update:modelValue'])
</script>
```

**Uso con v-model:**

```vue
<AppInput
  v-model="email"
  label="Correo electrónico"
  type="email"
  placeholder="tu@correo.com"
  :error="emailError"
  required
/>
```

---

## 11. Utilities y formatters

Funciones puras (sin estado, sin Vue) que transforman datos.

```typescript
// src/utils/formatters.ts

// Formatea una fecha ISO a texto legible en español
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  // "sábado, 15 de diciembre de 2024"
}

// Formatea montos monetarios
export function formatCurrency(amount: number, currency = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
  }).format(amount)
  // "S/ 150.00"
}

// Formatea duración de horas
export function formatDuration(hours: number): string {
  if (hours < 1) return `${hours * 60} minutos`
  if (hours === 1) return '1 hora'
  return `${hours} horas`
  // "3 horas"
}
```

```typescript
// src/utils/validators.ts

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongPassword(password: string): boolean {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

// Validación de RUC peruano (11 dígitos)
export function isValidRUC(ruc: string): boolean {
  return /^\d{11}$/.test(ruc)
}
```

---

## 12. Flujo completo de una petición

Este diagrama muestra el viaje completo de datos cuando un cliente crea una reserva:

```
Usuario hace click en "Confirmar Reserva"
              │
              ▼
    BookingDetailView.vue
    llama: createBooking(dto)
              │
              ▼
    useBookings.ts (Composable)
    - isLoading.value = true
    - llama: await createBooking(dto)
              │
              ▼
    features/bookings/services/create.ts
    - api.post('/bookings', dto)
              │
              ▼
    src/api/axios.ts (Interceptor de Request)
    - Agrega header: Authorization: Bearer eyJ...
              │
              ▼
    Backend NestJS recibe POST /bookings
    - JwtAuthGuard verifica el token
    - ValidationPipe valida CreateBookingDto
    - BookingsController → BookingsService → BookingRepository → PostgreSQL
    - Responde: 201 Created con BookingEntity
              │
              ▼
    src/api/axios.ts (Interceptor de Response)
    - 201 OK → deja pasar sin modificar
              │
              ▼
    features/bookings/services/create.ts
    - Devuelve: BookingEntity
              │
              ▼
    useBookings.ts (Composable)
    - bookings.value.unshift(newBooking)  ← agrega al inicio de la lista
    - isLoading.value = false
    - useToast().success('Reserva creada')
    - router.push('/bookings/' + newBooking.id)
              │
              ▼
    BookingDetailView.vue
    - Vue detecta el cambio en isLoading y bookings
    - Re-renderiza automáticamente
    - El usuario ve la nueva reserva en detalle
```

---

## Resumen de principios

| Principio | Dónde se aplica en Cleanly |
|-----------|---------------------------|
| **Un archivo, una responsabilidad** | Services hacen solo una petición. Composables manejan solo su feature. |
| **No repetir lógica** | Composables reutilizables: `useAuth`, `useCrud`, `useToast` |
| **Bajo acoplamiento** | Las views no llaman a Axios directamente. Los composables no saben de qué view los usan. |
| **Tipos en todas partes** | TypeScript en cada archivo: componentes, composables, services, utils |
| **Lazy loading de rutas** | Cada view se descarga solo cuando se necesita |
| **Estado centralizado** | Variables de estado fuera de la función en composables globales (`useAuth`) |
| **Código que se auto-documenta** | Nombres descriptivos: `BookingStatusBadge`, `WorkerMatchCard`, `useServiceRequests` |

Con esta arquitectura, puedes:
- **Agregar un feature nuevo** creando una carpeta en `features/` sin tocar el resto.
- **Eliminar una feature** borrando su carpeta y quitando sus rutas.
- **Reutilizar lógica** entre views usando composables.
- **Trabajar en equipo** donde cada persona trabaja en su carpeta de feature sin conflictos.
