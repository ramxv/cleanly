# 🏗️ Cleanly Backend — Guía Completa de Arquitectura

Bienvenido al backend de **Cleanly**. Este documento está escrito para desarrolladores que nunca han visto conceptos como SOLID, Clean Architecture o Inyección de Dependencias. No se asume ningún conocimiento previo. Al terminar de leer esto, entenderás *por qué* cada archivo existe y *cómo* encaja con los demás.

---

## Tabla de Contenidos

1. [El problema que resolvemos](#1-el-problema-que-resolvemos)
2. [Principios SOLID — explicados desde cero](#2-principios-solid--explicados-desde-cero)
3. [Inyección de Dependencias (DI)](#3-inyección-de-dependencias-di)
4. [Clean Architecture — las capas del sistema](#4-clean-architecture--las-capas-del-sistema)
5. [Patrones de diseño usados](#5-patrones-de-diseño-usados)
6. [Estructura real de directorios](#6-estructura-real-de-directorios)
7. [Anatomía completa de un módulo](#7-anatomía-completa-de-un-módulo)
8. [Casos de uso reales paso a paso](#8-casos-de-uso-reales-paso-a-paso)
9. [La capa de Infraestructura](#9-la-capa-de-infraestructura)
10. [Prisma — la capa de base de datos](#10-prisma--la-capa-de-base-de-datos)

---

## 1. El problema que resolvemos

Imagina que eres nuevo en un proyecto y ves este código en un solo archivo:

```typescript
// ❌ MAL — Todo mezclado en el controlador (código espagueti)
@Post('/bookings')
async createBooking(@Body() body: any) {
  // Validar datos a mano
  if (!body.workerId) throw new Error('falta workerId');

  // Consultar la DB directamente desde el controlador
  const worker = await prisma.workerProfile.findUnique({
    where: { id: body.workerId }
  });

  // Lógica de negocio mezclada
  if (!worker.isAvailable) throw new Error('trabajador no disponible');
  const price = worker.hourlyRate * body.hours;

  // Guardar en DB
  const booking = await prisma.booking.create({ data: { ...body, price } });

  // Llamar al gateway de pago
  const payment = await fetch('https://paguelofacil.com/pay', {
    body: JSON.stringify({ amount: price })
  });

  return booking;
}
```

Este código funciona, pero tiene problemas gravísimos:

- **Si cambias de base de datos** (de PostgreSQL a MySQL), tienes que buscar y modificar cada archivo del proyecto.
- **Si cambias de pasarela de pago** (de PaguéloFácil a Stripe), igual.
- **Es imposible hacer pruebas automáticas** porque no puedes simular la DB ni los pagos sin ejecutar todo el sistema real.
- **Dos personas no pueden trabajar en esto al mismo tiempo** sin pisarse el código.

La solución de Cleanly es **separar responsabilidades en capas** y comunicarlas a través de **contratos (interfaces)**.

---

## 2. Principios SOLID — explicados desde cero

SOLID es un acrónimo de 5 principios de diseño de software. No son reglas mágicas: son lecciones aprendidas a lo largo de décadas de hacer software que se rompe.

### S — Single Responsibility Principle (Principio de Responsabilidad Única)

> "Cada clase o módulo debe tener **una sola razón para cambiar**."

En términos simples: **un archivo hace una cosa, y la hace bien**.

**Ejemplo sin SOLID (mal):**

```typescript
// ❌ WorkersService hace demasiadas cosas
class WorkersService {
  async registerWorker(data) {
    // 1. Valida los datos
    if (!data.email.includes('@')) throw new Error('email inválido');

    // 2. Guarda en la base de datos
    await prisma.user.create({ data });

    // 3. Envía un email de bienvenida
    await sendEmail(data.email, 'Bienvenido a Cleanly');

    // 4. Sube el documento de identidad a S3
    await uploadToS3(data.document);
  }
}
```

Si mañana cambias el proveedor de email, tienes que tocar `WorkersService`. Si cambias de S3 a otro storage, también. Este archivo tiene 4 razones para cambiar.

**Ejemplo con SOLID (bien) — como está en Cleanly:**

```typescript
// ✅ workers.service.ts — solo orquesta la lógica de negocio
class WorkersService implements IWorkersService {
  constructor(
    private readonly workerRepo: IWorkerRepository,
    private readonly mailService: MailService,      // delega el email
    private readonly storageService: IStorageService // delega el storage
  ) {}

  async registerWorker(dto: CreateWorkerProfileDto) {
    // Solo coordina. No implementa nada directamente.
    const worker = await this.workerRepo.create(dto);
    await this.mailService.sendWelcomeEmail(worker.email);
    await this.storageService.uploadDocument(dto.document);
    return worker;
  }
}
```

Ahora cada cambio afecta solo al archivo correcto:
- Cambiar lógica de negocio → toca `workers.service.ts`
- Cambiar email → toca `mail.service.ts`
- Cambiar storage → toca `s3.service.ts`

---

### O — Open/Closed Principle (Principio Abierto/Cerrado)

> "El código debe estar **abierto para extensión** pero **cerrado para modificación**."

Es decir: puedes agregar funcionalidades nuevas sin tocar el código que ya funciona.

**Ejemplo real en Cleanly — el módulo de pagos:**

Tenemos una interfaz de estrategia de pago:

```typescript
// src/modules/payments/interfaces/ipayment-strategy.ts
export interface IPaymentStrategy {
  processPayment(amount: number, bookingId: string): Promise<PaymentResult>;
}
```

Hoy implementamos PaguéloFácil:

```typescript
// src/modules/payments/strategies/paguelofacil.strategy.ts
export class PaguéloFácilStrategy implements IPaymentStrategy {
  async processPayment(amount: number, bookingId: string) {
    // lógica específica de PaguéloFácil
    return await this.paguelofacilClient.charge({ amount, ref: bookingId });
  }
}
```

Mañana necesitamos agregar Stripe. ¿Tocamos `payments.service.ts`? **No.**

```typescript
// src/modules/payments/strategies/stripe.strategy.ts  ← archivo NUEVO
export class StripeStrategy implements IPaymentStrategy {
  async processPayment(amount: number, bookingId: string) {
    return await this.stripeClient.paymentIntents.create({ amount });
  }
}
```

Solo cambiamos qué estrategia se inyecta en el módulo. El `PaymentsService` no sabe ni le importa cuál está usando.

---

### L — Liskov Substitution Principle (Principio de Sustitución de Liskov)

> "Si `B` extiende `A`, deberías poder usar `B` en cualquier lugar donde usas `A` sin romper nada."

Dicho más simple: **cualquier implementación de una interfaz debe comportarse como la interfaz promete**.

**Ejemplo en Cleanly:**

La interfaz `IStorageService` promete:

```typescript
// src/infrastructure/storage/storage.interface.ts
export interface IStorageService {
  upload(file: Buffer, path: string): Promise<string>;  // devuelve la URL
  delete(path: string): Promise<void>;
}
```

Cualquier clase que implemente `IStorageService` debe respetar ese contrato:

```typescript
// ✅ S3Service cumple el contrato
export class S3Service implements IStorageService {
  async upload(file: Buffer, path: string): Promise<string> {
    const result = await this.s3.upload({ Body: file, Key: path }).promise();
    return result.Location; // devuelve la URL, como prometió la interfaz
  }

  async delete(path: string): Promise<void> {
    await this.s3.deleteObject({ Key: path }).promise();
  }
}
```

Si mañana creas `LocalStorageService` para pruebas, también debe devolver una URL en `upload()` y no lanzar excepciones raras en `delete()`. Si cumple eso, puedes intercambiarlo sin romper el sistema.

---

### I — Interface Segregation Principle (Principio de Segregación de Interfaces)

> "No obligues a una clase a implementar métodos que no necesita."

**Mal ejemplo:**

```typescript
// ❌ Una interfaz dios que lo sabe todo
export interface IUserService {
  createUser(): void;
  deleteUser(): void;
  banUser(): void;          // solo los admins hacen esto
  generateReport(): void;   // solo los admins hacen esto
  getProfile(): void;
}
```

Si un `WorkerService` implementa `IUserService`, se ve obligado a implementar `banUser()` y `generateReport()` aunque no tenga sentido para él.

**Bien — como está en Cleanly:**

Tenemos interfaces separadas por rol y responsabilidad:

```typescript
// src/modules/workers/interfaces/iworkers.service.ts
export interface IWorkersService {
  getProfile(workerId: string): Promise<WorkerProfileEntity>;
  updateAvailability(workerId: string, dto: UpdateAvailabilityDto): Promise<void>;
  uploadDocuments(workerId: string, files: Express.Multer.File[]): Promise<void>;
}

// src/modules/admin/interfaces/iadmin.service.ts
export interface IAdminService {
  verifyWorker(workerId: string, dto: VerifyWorkerDto): Promise<void>;
  resolveDispute(bookingId: string, dto: ResolveDisputeDto): Promise<void>;
  getDashboardMetrics(): Promise<AdminMetrics>;
}
```

Cada servicio tiene exactamente los métodos que necesita, ni más ni menos.

---

### D — Dependency Inversion Principle (Principio de Inversión de Dependencias)

> "Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de **abstracciones (interfaces)**."

Este es el principio más importante y el que da vida a toda nuestra arquitectura. Lo explicamos en profundidad en la siguiente sección.

**Antes (acoplado):**

```typescript
// ❌ El controlador depende de la clase concreta
import { WorkersService } from './services/workers.service';

class WorkersController {
  constructor(private readonly service: WorkersService) {} // ← clase concreta
}
```

**Después (desacoplado) — como en Cleanly:**

```typescript
// ✅ El controlador depende de la INTERFAZ (abstracción)
import { IWorkersService } from './interfaces/iworkers.service';
import { WORKER_SERVICE } from './workers.tokens';

class WorkersController {
  constructor(
    @Inject(WORKER_SERVICE)
    private readonly service: IWorkersService  // ← interfaz, no clase
  ) {}
}
```

El controlador nunca sabe si habla con `WorkersService`, `MockWorkersService` (para tests) o `CachedWorkersService` (una versión con caché). Solo sabe que tiene los métodos que promete `IWorkersService`.

---

## 3. Inyección de Dependencias (DI)

### ¿Qué es?

Imagina que tienes que construir una casa. Puedes:

**Opción A (sin DI):** Cada habitación fabrica sus propios ladrillos, su propio cemento y sus propias ventanas internamente. Si quieres cambiar el tipo de ventana, tienes que entrar a cada habitación y modificarla.

**Opción B (con DI):** Un proveedor externo (NestJS en nuestro caso) te da los ladrillos, el cemento y las ventanas ya hechas. Cada habitación solo dice: "necesito una ventana" y el proveedor se la entrega.

### ¿Cómo funciona en NestJS?

NestJS tiene un **contenedor de IoC (Inversión de Control)** que actúa como ese proveedor central. Tú registras tus servicios en él y él se encarga de crearlos y entregarlos a quien los necesite.

### Los Tokens — el identificador único

En Cleanly, usamos **tokens** para identificar qué implementación debe inyectarse cuando alguien pide una interfaz:

```typescript
// src/modules/workers/workers.tokens.ts
export const WORKER_SERVICE = 'WORKER_SERVICE';
export const WORKER_REPOSITORY = 'WORKER_REPOSITORY';
```

Los tokens son simplemente strings (o Symbols) únicos. Son como llaves que el contenedor de DI usa para saber cuál clase entregar.

### El módulo — donde se registra todo

```typescript
// src/modules/workers/workers.module.ts
@Module({
  providers: [
    {
      provide: WORKER_SERVICE,          // "cuando alguien pida WORKER_SERVICE..."
      useClass: WorkersService,         // "...dale una instancia de WorkersService"
    },
    {
      provide: WORKER_REPOSITORY,       // "cuando alguien pida WORKER_REPOSITORY..."
      useClass: WorkerRepository,       // "...dale una instancia de WorkerRepository"
    },
  ],
  controllers: [WorkersController],
})
export class WorkersModule {}
```

### Inyectando en el controlador

```typescript
// src/modules/workers/controllers/workers.controller.ts
@Controller('workers')
export class WorkersController {
  constructor(
    @Inject(WORKER_SERVICE)               // "dame lo que está registrado como WORKER_SERVICE"
    private readonly workersService: IWorkersService,  // pero yo lo trato como esta interfaz
  ) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.workersService.getProfile(id);
    // El controlador no sabe ni le importa que adentro se usa Prisma
  }
}
```

### Inyectando en el servicio

```typescript
// src/modules/workers/services/workers.service.ts
@Injectable()
export class WorkersService implements IWorkersService {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepo: IWorkerRepository,   // interfaz del repo

    private readonly storageService: S3Service,       // servicio de infra
    private readonly mailService: MailService,        // servicio de infra
  ) {}

  async getProfile(workerId: string): Promise<WorkerProfileEntity> {
    return this.workerRepo.findById(workerId);
    // WorkersService no sabe que WorkerRepository usa Prisma
  }
}
```

### ¿Por qué esto es tan poderoso?

**Para hacer tests unitarios:** Puedes inyectar un repositorio falso (mock) que devuelve datos hardcodeados, sin necesidad de tener una base de datos corriendo:

```typescript
// En un test
const mockWorkerRepo: IWorkerRepository = {
  findById: jest.fn().mockResolvedValue({ id: '1', name: 'Ana García' }),
  create: jest.fn(),
};

const service = new WorkersService(mockWorkerRepo, mockStorage, mockMail);
const result = await service.getProfile('1');
expect(result.name).toBe('Ana García'); // ✅ sin DB real
```

---

## 4. Clean Architecture — las capas del sistema

Nuestra arquitectura tiene 4 capas. La regla de oro es: **las capas internas no conocen a las externas**.

```
┌─────────────────────────────────────────┐
│  CAPA 4: Infraestructura & Framework    │  ← NestJS, HTTP, Prisma, S3, Mail
│  ┌───────────────────────────────────┐  │
│  │  CAPA 3: Controllers & DTOs       │  │  ← Recibe peticiones HTTP
│  │  ┌─────────────────────────────┐  │  │
│  │  │  CAPA 2: Services (Casos    │  │  │  ← Lógica de negocio
│  │  │  de Uso / Use Cases)        │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │  CAPA 1: Interfaces   │  │  │  │  ← Los contratos (el corazón)
│  │  │  │  & Entities           │  │  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

- **Capa 1 (Entities e Interfaces):** Las interfaces (`IWorkersService`, `IWorkerRepository`) y las entidades de negocio puras. No dependen de NADA externo. Son los contratos.
- **Capa 2 (Services):** Los casos de uso reales. Dependen solo de interfaces (capa 1). Nunca de Prisma, nunca de NestJS directamente.
- **Capa 3 (Controllers & DTOs):** Reciben HTTP y validan datos. Dependen solo de interfaces de servicio (capa 1).
- **Capa 4 (Infrastructure):** Las implementaciones concretas de todo: Prisma (repositorios), S3, correos, tareas programadas. Dependen de las interfaces de capa 1.

---

## 5. Patrones de diseño usados

### Patrón Repository

El patrón Repository actúa como una **colección virtual** de entidades de negocio. Oculta todos los detalles de cómo se guardan y recuperan los datos.

```
Service  →  IRepository (interfaz)  →  Repository (implementación con Prisma)
                                              ↓
                                         PostgreSQL
```

**Interfaz del repositorio:**

```typescript
// src/modules/workers/interfaces/iworker.repository.ts
export interface IWorkerRepository {
  findById(id: string): Promise<WorkerProfileEntity | null>;
  findByZone(zone: string): Promise<WorkerProfileEntity[]>;
  create(data: CreateWorkerProfileDto): Promise<WorkerProfileEntity>;
  updateAvailability(id: string, slots: TimeSlot[]): Promise<void>;
}
```

**Implementación real con Prisma:**

```typescript
// src/modules/workers/repositories/worker.repository.ts
@Injectable()
export class WorkerRepository implements IWorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkerProfileEntity | null> {
    const raw = await this.prisma.workerProfile.findUnique({ where: { id } });
    if (!raw) return null;
    return new WorkerProfileEntity(raw); // mapea a entidad de negocio
  }

  async findByZone(zone: string): Promise<WorkerProfileEntity[]> {
    const workers = await this.prisma.workerProfile.findMany({
      where: { serviceZones: { has: zone }, isAvailable: true }
    });
    return workers.map(w => new WorkerProfileEntity(w));
  }
}
```

### Patrón Strategy

Permite elegir entre múltiples algoritmos intercambiables en tiempo de ejecución.

**Caso real — estrategia de matching de trabajadores:**

```typescript
// src/modules/services-request/interfaces/imatching.strategy.ts
export interface IMatchingStrategy {
  findMatches(request: ServiceRequestEntity): Promise<WorkerProfileEntity[]>;
}

// src/modules/services-request/strategies/worker-matching.strategy.ts
@Injectable()
export class WorkerMatchingStrategy implements IMatchingStrategy {
  async findMatches(request: ServiceRequestEntity) {
    // Algoritmo 1: busca trabajadores por zona geográfica y disponibilidad
    return this.workerRepo.findByZoneAndDate(
      request.zone,
      request.scheduledDate
    );
  }
}

// En el futuro puedes agregar:
// export class AIMatchingStrategy implements IMatchingStrategy { ... }
// Sin tocar ServicesRequestService
```

**Caso real — estrategias de pago:**

```typescript
// src/infrastructure/payments/ipayment-gateway.interface.ts
export interface IPaymentGateway {
  charge(amount: number, token: string): Promise<{ transactionId: string }>;
  refund(transactionId: string): Promise<void>;
}

// Implementación actual
// src/infrastructure/payments/paguelofacil.service.ts
@Injectable()
export class PaguéloFácilService implements IPaymentGateway {
  async charge(amount: number, token: string) {
    // Llama a la API real de PaguéloFácil
  }
  async refund(transactionId: string) { ... }
}
```

---

## 6. Estructura real de directorios

Este es el árbol exacto del proyecto tal como existe en el repositorio:

```text
backend/src/
├── app.module.ts                          # Módulo raíz — registra todos los módulos
├── main.ts                                # Punto de entrada — arranca NestJS
│
├── infrastructure/                        # Conexiones al mundo exterior
│   ├── mail/
│   │   ├── mail.module.ts                 # Registra el servicio de correos
│   │   └── mail.service.ts               # Envía emails (SendGrid, Nodemailer, etc.)
│   ├── payments/
│   │   ├── ipayment-gateway.interface.ts  # Contrato del gateway de pago
│   │   ├── paguelofacil.service.ts        # Implementación de PaguéloFácil
│   │   ├── payments.module.ts             # Registra el gateway
│   │   └── payments.tokens.ts            # Token de inyección del gateway
│   ├── storage/
│   │   ├── s3.provider.ts                # Crea la instancia del cliente AWS S3
│   │   ├── s3.service.ts                 # Implementación de subida/bajada en S3
│   │   ├── storage.interface.ts          # Contrato de storage genérico
│   │   ├── storage.module.ts             # Registra el servicio de storage
│   │   └── storage.tokens.ts            # Token de inyección del storage
│   └── tasks/
│       ├── booking-auto-complete.task.ts  # Tarea programada: auto-completar bookings
│       └── tasks.module.ts               # Registra las tareas (cron jobs)
│
├── modules/                              # Módulos de negocio (el corazón de la API)
│   │
│   ├── admin/                            # Panel administrativo
│   │   ├── admin.module.ts
│   │   ├── admin.tokens.ts
│   │   ├── controllers/
│   │   │   └── admin.controller.ts       # POST /admin/verify-worker, etc.
│   │   ├── dto/
│   │   │   ├── resolve-dispute.dto.ts    # Validación para resolver disputas
│   │   │   └── verify-worker.dto.ts      # Validación para verificar trabajadores
│   │   ├── interfaces/
│   │   │   ├── iadmin.repository.ts      # Contrato del repositorio admin
│   │   │   └── iadmin.service.ts         # Contrato del servicio admin
│   │   ├── repositories/
│   │   │   └── admin.repository.ts       # Queries Prisma del admin
│   │   └── services/
│   │       └── admin.service.ts          # Lógica: suspender cuentas, métricas
│   │
│   ├── auth/                             # Autenticación y autorización
│   │   ├── auth.module.ts
│   │   ├── auth.tokens.ts
│   │   ├── controllers/
│   │   │   └── auth.controller.ts        # POST /auth/login, POST /auth/register
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts # @CurrentUser() — extrae user del JWT
│   │   │   └── roles.decorator.ts        # @Roles('ADMIN') — marca roles requeridos
│   │   ├── dto/
│   │   │   ├── index.ts                  # Re-exporta todos los DTOs de auth
│   │   │   ├── login.dto.ts              # { email: string, password: string }
│   │   │   └── register.dto.ts           # Datos para registro de usuario
│   │   ├── entities/
│   │   │   ├── auth-response.entity.ts   # { accessToken, user } que devuelve el login
│   │   │   └── user.entity.ts            # Entidad User de negocio (sin password hash)
│   │   ├── guards/
│   │   │   ├── jwt.guard.ts              # Verifica que el token JWT sea válido
│   │   │   └── roles.guard.ts            # Verifica que el usuario tenga el rol correcto
│   │   ├── interfaces/
│   │   │   ├── iauth.repository.ts       # findByEmail, create, etc.
│   │   │   └── iauth.service.ts          # login(), register(), refreshToken()
│   │   ├── repositories/
│   │   │   └── auth.repository.ts        # Queries Prisma de usuarios
│   │   ├── services/
│   │   │   └── auth.service.ts           # Valida contraseñas, genera JWT
│   │   └── strategies/
│   │       └── jwt.strategy.ts           # Passport: extrae y valida el payload del JWT
│   │
│   ├── bookings/                         # Reservas y agendamientos
│   │   ├── bookings.module.ts
│   │   ├── bookings.tokens.ts
│   │   ├── controllers/
│   │   │   └── bookings.controller.ts    # POST /bookings, GET /bookings/:id
│   │   ├── dto/
│   │   │   ├── cancel-booking.dto.ts     # { reason: string }
│   │   │   ├── create-booking.dto.ts     # { workerId, date, serviceType, hours }
│   │   │   └── index.ts
│   │   ├── entities/
│   │   │   └── booking.entity.ts         # Entidad Booking de negocio
│   │   ├── interfaces/
│   │   │   ├── ibooking.repository.ts    # findById, create, updateStatus, etc.
│   │   │   └── ibookings.service.ts      # createBooking, cancelBooking, etc.
│   │   ├── repositories/
│   │   │   └── booking.repository.ts     # Queries Prisma de bookings
│   │   └── services/
│   │       └── bookings.service.ts       # Lógica: chequear disponibilidad, calcular precio
│   │
│   ├── loyalty/                          # Sistema de puntos y cupones
│   │   ├── loyalty.module.ts
│   │   ├── loyalty.tokens.ts
│   │   ├── controllers/
│   │   │   └── loyalty.controller.ts     # GET /loyalty/coupons, POST /loyalty/redeem
│   │   ├── entities/
│   │   │   └── loyalty-coupon.entity.ts  # Entidad Cupón
│   │   ├── interfaces/
│   │   │   └── iloyalty.repository.ts    # findCouponsByUser, applyCoupon, etc.
│   │   ├── repositories/
│   │   │   └── loyalty.repository.ts     # Queries Prisma de cupones
│   │   └── services/
│   │       └── loyalty.service.ts        # Lógica: validar cupón, sumar puntos
│   │
│   ├── payments/                         # Procesamiento de pagos
│   │   ├── payments.module.ts
│   │   ├── payments.tokens.ts
│   │   ├── controllers/
│   │   │   └── payments.controller.ts    # POST /payments/process
│   │   ├── dto/
│   │   │   ├── index.ts
│   │   │   └── process-payment.dto.ts    # { bookingId, paymentToken, method }
│   │   ├── entities/
│   │   │   └── payment.entity.ts         # Entidad Payment de negocio
│   │   ├── interfaces/
│   │   │   ├── ipayment.repository.ts    # createRecord, findByBooking, etc.
│   │   │   ├── ipayments.service.ts      # processPayment, requestRefund, etc.
│   │   │   └── ipayment-strategy.ts      # Contrato de estrategia de pago
│   │   ├── repositories/
│   │   │   └── payment.repository.ts     # Queries Prisma de pagos
│   │   ├── services/
│   │   │   └── payments.service.ts       # Orquesta: valida booking, cobra, guarda
│   │   └── strategies/
│   │       └── paguelofacil.strategy.ts  # Implementa IPaymentStrategy con PaguéloFácil
│   │
│   ├── reviews/                          # Reseñas post-servicio
│   │   ├── reviews.module.ts
│   │   ├── controllers/
│   │   │   └── reviews.controller.ts     # POST /reviews, GET /reviews/worker/:id
│   │   ├── dto/
│   │   │   └── create-review.dto.ts      # { rating: 1-5, comment: string }
│   │   ├── entities/
│   │   │   └── review.entity.ts          # Entidad Review de negocio
│   │   ├── interfaces/
│   │   │   └── ireview.repository.ts     # create, findByWorker, getAverageRating
│   │   ├── repositories/
│   │   │   └── review.repository.ts      # Queries Prisma de reseñas
│   │   └── services/
│   │       ├── review.tokens.ts
│   │       └── reviews.service.ts        # Lógica: solo puede reseñar si el booking está completado
│   │
│   ├── services-request/                 # Búsqueda de trabajadores antes del booking
│   │   ├── services-request.module.ts
│   │   ├── services-request.tokens.ts
│   │   ├── controllers/
│   │   │   └── services-request.controller.ts  # POST /service-requests/search
│   │   ├── dto/
│   │   │   ├── create-service-request.dto.ts   # { zone, date, serviceType }
│   │   │   └── index.ts
│   │   ├── entities/
│   │   │   └── service-request.entity.ts
│   │   ├── interfaces/
│   │   │   ├── imatching.strategy.ts     # Contrato del algoritmo de matching
│   │   │   └── iservice-request.repository.ts
│   │   ├── repositories/
│   │   │   └── service-request.repository.ts
│   │   ├── services/
│   │   │   └── services-request.service.ts     # Orquesta la búsqueda de matches
│   │   └── strategies/
│   │       └── worker-matching.strategy.ts     # Algoritmo de matching actual
│   │
│   └── workers/                          # Perfiles y disponibilidad de trabajadores
│       ├── workers.module.ts
│       ├── workers.tokens.ts
│       ├── controllers/
│       │   └── workers.controller.ts     # GET /workers/:id, PATCH /workers/availability
│       ├── dto/
│       │   ├── create-worker-profile.dto.ts    # Datos de registro del trabajador
│       │   ├── index.ts
│       │   └── update-availability.dto.ts      # Franjas horarias disponibles
│       ├── entities/
│       │   ├── availability.entity.ts    # Entidad de bloque horario
│       │   └── worker-profile.entity.ts  # Entidad perfil del trabajador
│       ├── interfaces/
│       │   ├── iworker.repository.ts     # findById, findByZone, updateAvailability
│       │   └── iworkers.service.ts       # getProfile, updateAvailability, uploadDocuments
│       ├── repositories/
│       │   └── worker.repository.ts      # Queries Prisma de trabajadores
│       └── services/
│           └── workers.service.ts        # Lógica: validar documentos, calcular rating promedio
│
└── prisma/
    ├── prisma.module.ts                  # Registra PrismaService globalmente
    └── prisma.service.ts                # Extiende PrismaClient, maneja conexión/desconexión
```

---

## 7. Anatomía completa de un módulo

Tomemos `workers` como ejemplo de cómo cada capa se conecta con las demás.

### Paso 1: La Entidad (qué es un Worker para el negocio)

```typescript
// src/modules/workers/entities/worker-profile.entity.ts
export class WorkerProfileEntity {
  id: string;
  userId: string;
  displayName: string;
  serviceZones: string[];
  hourlyRate: number;
  isVerified: boolean;
  isAvailable: boolean;
  averageRating: number;
  completedJobs: number;

  constructor(raw: any) {
    this.id = raw.id;
    this.displayName = raw.user?.name ?? raw.displayName;
    this.serviceZones = raw.serviceZones;
    this.hourlyRate = raw.hourlyRate;
    this.isVerified = raw.isVerified;
    this.isAvailable = raw.isAvailable;
    this.averageRating = raw.averageRating ?? 0;
    this.completedJobs = raw.completedJobs ?? 0;
  }
}
```

### Paso 2: Las Interfaces (los contratos)

```typescript
// src/modules/workers/interfaces/iworker.repository.ts
export interface IWorkerRepository {
  findById(id: string): Promise<WorkerProfileEntity | null>;
  findByZone(zone: string): Promise<WorkerProfileEntity[]>;
  create(data: CreateWorkerProfileDto): Promise<WorkerProfileEntity>;
  updateAvailability(id: string, dto: UpdateAvailabilityDto): Promise<void>;
  uploadDocuments(id: string, urls: string[]): Promise<void>;
}

// src/modules/workers/interfaces/iworkers.service.ts
export interface IWorkersService {
  getProfile(workerId: string): Promise<WorkerProfileEntity>;
  updateAvailability(workerId: string, dto: UpdateAvailabilityDto): Promise<void>;
  uploadDocuments(workerId: string, files: Express.Multer.File[]): Promise<void>;
}
```

### Paso 3: El DTO (validación de entrada HTTP)

```typescript
// src/modules/workers/dto/update-availability.dto.ts
import { IsArray, IsDateString, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TimeSlotDto {
  @IsDateString()
  startTime: string;   // "2024-12-01T09:00:00Z"

  @IsDateString()
  endTime: string;     // "2024-12-01T13:00:00Z"
}

export class UpdateAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  slots: TimeSlotDto[];   // NestJS rechazará el request si esto no es un array de slots válidos
}
```

### Paso 4: El Repositorio (acceso a datos con Prisma)

```typescript
// src/modules/workers/repositories/worker.repository.ts
@Injectable()
export class WorkerRepository implements IWorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const raw = await this.prisma.workerProfile.findUnique({
      where: { id },
      include: { user: true, availabilitySlots: true }
    });
    return raw ? new WorkerProfileEntity(raw) : null;
  }

  async updateAvailability(id: string, dto: UpdateAvailabilityDto) {
    await this.prisma.$transaction([
      // Primero elimina los slots existentes
      this.prisma.availabilitySlot.deleteMany({ where: { workerId: id } }),
      // Luego crea los nuevos
      this.prisma.availabilitySlot.createMany({
        data: dto.slots.map(s => ({ workerId: id, ...s }))
      })
    ]);
  }
}
```

### Paso 5: El Servicio (casos de uso y lógica de negocio)

```typescript
// src/modules/workers/services/workers.service.ts
@Injectable()
export class WorkersService implements IWorkersService {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepo: IWorkerRepository,

    private readonly storageService: S3Service,
    private readonly mailService: MailService,
  ) {}

  async getProfile(workerId: string) {
    const worker = await this.workerRepo.findById(workerId);
    if (!worker) throw new NotFoundException(`Trabajador ${workerId} no encontrado`);
    return worker;
  }

  async uploadDocuments(workerId: string, files: Express.Multer.File[]) {
    const worker = await this.workerRepo.findById(workerId);
    if (!worker) throw new NotFoundException('Trabajador no encontrado');

    // Lógica de negocio: sube cada archivo y obtiene la URL pública
    const urls = await Promise.all(
      files.map(file =>
        this.storageService.upload(file.buffer, `workers/${workerId}/${file.originalname}`)
      )
    );

    await this.workerRepo.uploadDocuments(workerId, urls);
    await this.mailService.sendDocumentsReceivedEmail(worker);
  }
}
```

### Paso 6: El Controlador (la puerta de entrada HTTP)

```typescript
// src/modules/workers/controllers/workers.controller.ts
@Controller('workers')
@UseGuards(JwtAuthGuard)   // protege todos los endpoints de este controlador
export class WorkersController {
  constructor(
    @Inject(WORKER_SERVICE)
    private readonly workersService: IWorkersService,
  ) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.workersService.getProfile(id);
  }

  @Patch('availability')
  @Roles('WORKER')
  @UseGuards(RolesGuard)
  updateAvailability(
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.workersService.updateAvailability(user.workerId, dto);
  }

  @Post('documents')
  @Roles('WORKER')
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('documents'))
  uploadDocuments(
    @CurrentUser() user: UserEntity,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.workersService.uploadDocuments(user.workerId, files);
  }
}
```

### Paso 7: El Módulo (conecta todo)

```typescript
// src/modules/workers/workers.module.ts
@Module({
  imports: [StorageModule, MailModule],  // importa los módulos de infra que necesita
  providers: [
    {
      provide: WORKER_SERVICE,
      useClass: WorkersService,
    },
    {
      provide: WORKER_REPOSITORY,
      useClass: WorkerRepository,
    },
  ],
  controllers: [WorkersController],
  exports: [WORKER_SERVICE],  // exporta para que otros módulos puedan inyectarlo
})
export class WorkersModule {}
```

---

## 8. Casos de uso reales paso a paso

### Caso 1: Un cliente hace login

**Petición:** `POST /auth/login` con `{ email: "cliente@mail.com", password: "mi-clave" }`

```
1. HTTP Request llega a NestJS
        ↓
2. ValidationPipe valida LoginDto
   - ¿email tiene formato válido? ¿password tiene mínimo 6 caracteres?
   - Si falla → 400 Bad Request automáticamente
        ↓
3. AuthController.login(dto)
   - Llama a: this.authService.login(dto)
        ↓
4. AuthService.login(dto)
   - Llama a: this.authRepo.findByEmail(dto.email)
   - Compara la contraseña con bcrypt.compare(dto.password, user.passwordHash)
   - Si no coincide → lanza UnauthorizedException
   - Si coincide → genera JWT con jwtService.sign({ userId, role })
   - Devuelve: { accessToken, user: UserEntity }
        ↓
5. AuthRepository.findByEmail(email)
   - Ejecuta: prisma.user.findUnique({ where: { email } })
   - Mapea el resultado a UserEntity
        ↓
6. Respuesta 200 OK con { accessToken: "eyJ...", user: { id, name, role } }
```

### Caso 2: Un cliente busca trabajadores disponibles

**Petición:** `POST /service-requests/search` con `{ zone: "Miraflores", date: "2024-12-15", serviceType: "DEEP_CLEAN" }`

```
1. JwtAuthGuard verifica el token JWT
   - Extrae userId y role del token
   - Si no hay token o es inválido → 401 Unauthorized
        ↓
2. ValidationPipe valida CreateServiceRequestDto
        ↓
3. ServicesRequestController.search(dto)
   - Llama a: this.servicesRequestService.findMatches(dto)
        ↓
4. ServicesRequestService.findMatches(dto)
   - Guarda el request en DB: await this.serviceRequestRepo.create(dto)
   - Ejecuta la estrategia de matching: await this.matchingStrategy.findMatches(request)
        ↓
5. WorkerMatchingStrategy.findMatches(request)
   - Llama a: this.workerRepo.findByZoneAndDate(request.zone, request.date)
   - Filtra por: serviceType compatible, isVerified: true, isAvailable: true
   - Ordena por: averageRating DESC
        ↓
6. Respuesta 200 OK con array de WorkerProfileEntity[] (los mejores matches)
```

### Caso 3: Un trabajador acepta un booking y se procesa el pago

**Petición:** `PATCH /bookings/:id/accept` (del trabajador)
**Después:** `POST /payments/process` (del cliente)

```
=== Aceptar Booking ===
1. JwtAuthGuard + RolesGuard('WORKER') verifican identity y rol
2. BookingsController.acceptBooking(id, currentUser)
3. BookingsService.acceptBooking(id, workerId)
   - Verifica que el booking existe y está en estado PENDING
   - Verifica que el workerId coincide con el del booking
   - Llama a: this.bookingRepo.updateStatus(id, 'ACCEPTED')
   - Llama a: this.mailService.sendBookingAcceptedEmail(client, worker)

=== Procesar Pago ===
1. JwtAuthGuard + RolesGuard('CLIENT') verifican identity y rol
2. PaymentsController.process(dto, currentUser)
3. PaymentsService.processPayment(dto, clientId)
   - Verifica que el booking existe y está en estado ACCEPTED
   - Verifica que el clientId es dueño del booking
   - Selecciona la estrategia: this.paymentGateway (inyectado)
   - Cobra: paymentGateway.charge(booking.totalPrice, dto.paymentToken)
   - Guarda registro: this.paymentRepo.createRecord({ bookingId, amount, transactionId })
   - Actualiza booking: this.bookingRepo.updateStatus(id, 'PAID')
   - Programa tarea: tarea CRON que marca como COMPLETED si pasan 24h
```

### Caso 4: Tarea programada auto-completa bookings

```typescript
// src/infrastructure/tasks/booking-auto-complete.task.ts
@Injectable()
export class BookingAutoCompleteTask {
  constructor(
    @Inject(BOOKINGS_SERVICE)
    private readonly bookingsService: IBookingsService,
  ) {}

  @Cron('0 * * * *')  // Ejecuta cada hora en punto
  async handle() {
    // Busca todos los bookings en estado PAID con más de 24 horas
    await this.bookingsService.autoCompleteExpiredBookings();
    // Esto activa: calcular comisión, transferir al trabajador, sumar puntos de loyalty
  }
}
```

---

## 9. La capa de Infraestructura

La infraestructura contiene todas las integraciones con el mundo externo. Están en `src/infrastructure/` y son importadas por los módulos que las necesitan.

### Mail Service

```typescript
// src/infrastructure/mail/mail.service.ts
@Injectable()
export class MailService {
  async sendWelcomeEmail(to: string, name: string) {
    // Podría usar SendGrid, Nodemailer, Resend, etc.
    // Los módulos de negocio no saben cuál usas.
  }

  async sendBookingConfirmationEmail(booking: BookingEntity) { ... }
  async sendDocumentsReceivedEmail(worker: WorkerProfileEntity) { ... }
}
```

### Storage Service (AWS S3)

```typescript
// src/infrastructure/storage/s3.service.ts
@Injectable()
export class S3Service implements IStorageService {
  constructor(
    @Inject(S3_CLIENT)     // inyecta el cliente S3 configurado
    private readonly s3: AWS.S3
  ) {}

  async upload(file: Buffer, path: string): Promise<string> {
    const result = await this.s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: path,
      Body: file,
      ContentType: 'application/pdf',
    }).promise();
    return result.Location;  // URL pública del archivo
  }

  async delete(path: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: path,
    }).promise();
  }
}
```

### Tokens de infraestructura

```typescript
// src/infrastructure/storage/storage.tokens.ts
export const STORAGE_SERVICE = 'STORAGE_SERVICE';

// src/infrastructure/payments/payments.tokens.ts
export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';
```

---

## 10. Prisma — la capa de base de datos

### ¿Qué es Prisma?

Prisma es un ORM (Object-Relational Mapper). Traduce objetos de TypeScript a consultas SQL, y resultados SQL de regreso a objetos TypeScript.

### PrismaService — el cliente global

```typescript
// src/prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();  // conecta a la DB cuando NestJS arranca
  }

  async onModuleDestroy() {
    await this.$disconnect();  // desconecta limpiamente al cerrar
  }
}
```

### PrismaModule — disponible en toda la app

```typescript
// src/prisma/prisma.module.ts
@Global()  // ← hace que PrismaService esté disponible en TODOS los módulos sin importarlo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Uso en repositorios

```typescript
// Los repositorios reciben PrismaService por inyección de dependencias
@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<BookingEntity | null> {
    const raw = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        client: true,
        worker: { include: { user: true } },
        payment: true,
      }
    });
    return raw ? new BookingEntity(raw) : null;
  }

  async updateStatus(id: string, status: BookingStatus) {
    await this.prisma.booking.update({
      where: { id },
      data: { status, updatedAt: new Date() }
    });
  }
}
```

---

## Resumen visual de todo el sistema

```
HTTP Request
     │
     ▼
┌──────────────────┐
│   Guards         │  JwtAuthGuard, RolesGuard — ¿Quién eres? ¿Tienes permiso?
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Controller     │  Solo recibe y delega. No tiene lógica.
└────────┬─────────┘
         │  (usa interfaz IXxxService)
         ▼
┌──────────────────┐
│   Service        │  TODA la lógica de negocio vive aquí
└────────┬─────────┘
         │  (usa interfaz IXxxRepository)
         ▼
┌──────────────────┐
│   Repository     │  Traduce a Prisma/SQL. No tiene lógica.
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PostgreSQL     │  La base de datos real
└──────────────────┘

Servicios externos (invocados desde Services o Infrastructure):
  MailService → proveedor de email
  S3Service → AWS S3 (documentos, fotos)
  PaymentGateway → PaguéloFácil (pagos)
  Tasks → Cron jobs (auto-completar bookings)
```

Con esta arquitectura, puedes:
- **Cambiar de base de datos** modificando solo los repositorios.
- **Cambiar de pasarela de pago** agregando una nueva estrategia.
- **Hacer tests** inyectando mocks en lugar de implementaciones reales.
- **Trabajar en equipo** sin que los cambios de un módulo rompan los demás.
