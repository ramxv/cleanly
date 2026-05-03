-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CLIENTE', 'TRABAJADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoVerificacion" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('ESTANDAR', 'PROFUNDA', 'POST_OBRA');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE_PAGO', 'CONFIRMADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA', 'DISPUTADA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'RETENIDO', 'LIBERADO', 'REEMBOLSADO', 'FALLIDO');

-- CreateEnum
CREATE TYPE "ActorCancelacion" AS ENUM ('CLIENTE', 'TRABAJADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasenaHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_clientes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "fotoUrl" TEXT,
    "contadorLealtad" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" TEXT NOT NULL,
    "perfilClienteId" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "direccionCompleta" TEXT NOT NULL,
    "barrio" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "esPredeterminada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_trabajadores" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "fotoUrl" TEXT,
    "biografia" TEXT,
    "estadoVerificacion" "EstadoVerificacion" NOT NULL DEFAULT 'PENDIENTE',
    "verificadoEn" TIMESTAMP(3),
    "motivoRechazo" TEXT,
    "calificacionPromedio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalResenas" INTEGER NOT NULL DEFAULT 0,
    "esPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumExpiraEn" TIMESTAMP(3),
    "tarifaPorHora" DOUBLE PRECISION NOT NULL,
    "tiposServicio" "TipoServicio"[],
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_trabajadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_trabajadores" (
    "id" TEXT NOT NULL,
    "perfilTrabajadorId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "archivoUrl" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3),
    "subidoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revisadoEn" TIMESTAMP(3),
    "aprobado" BOOLEAN,

    CONSTRAINT "documentos_trabajadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disponibilidades" (
    "id" TEXT NOT NULL,
    "perfilTrabajadorId" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,

    CONSTRAINT "disponibilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas_servicio" (
    "id" TEXT NOT NULL,
    "perfilTrabajadorId" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "barrio" TEXT,

    CONSTRAINT "zonas_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_servicio" (
    "id" TEXT NOT NULL,
    "perfilClienteId" TEXT NOT NULL,
    "tipoServicio" "TipoServicio" NOT NULL,
    "tamanoM2" DOUBLE PRECISION NOT NULL,
    "cantidadHabDir" INTEGER NOT NULL,
    "cantidadBanos" INTEGER NOT NULL,
    "notas" TEXT,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "barrio" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "presupuestoMax" DOUBLE PRECISION,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "perfilClienteId" TEXT NOT NULL,
    "perfilTrabajadorId" TEXT NOT NULL,
    "direccionId" TEXT NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "duracionEstimada" INTEGER NOT NULL,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    "confirmadaEn" TIMESTAMP(3),
    "iniciadaEn" TIMESTAMP(3),
    "completadaEn" TIMESTAMP(3),
    "canceladaEn" TIMESTAMP(3),
    "canceladoPor" "ActorCancelacion",
    "motivoCancelacion" TEXT,
    "montoPenalidad" DOUBLE PRECISION,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "monto" DOUBLE PRECISION NOT NULL,
    "tasaComision" DOUBLE PRECISION NOT NULL,
    "montoComision" DOUBLE PRECISION NOT NULL,
    "montoNeto" DOUBLE PRECISION NOT NULL,
    "referenciaPassarela" TEXT,
    "claveIdempotencia" TEXT NOT NULL,
    "retenidoEn" TIMESTAMP(3),
    "liberadoEn" TIMESTAMP(3),
    "reembolsadoEn" TIMESTAMP(3),
    "motivoReembolso" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "desdeclienteId" TEXT,
    "desdeTrabajadorId" TEXT,
    "paraClienteId" TEXT,
    "paraTrabajadorId" TEXT,
    "estrellas" INTEGER NOT NULL,
    "comentario" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "moderadaEn" TIMESTAMP(3),
    "motivoModeracion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones_premium" (
    "id" TEXT NOT NULL,
    "perfilTrabajadorId" TEXT NOT NULL,
    "inicioEn" TIMESTAMP(3) NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "referenciaPago" TEXT,

    CONSTRAINT "suscripciones_premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputas" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "abiertaPor" "Rol" NOT NULL,
    "motivo" TEXT NOT NULL,
    "resolucion" TEXT,
    "resueltaEn" TIMESTAMP(3),
    "resueltaPor" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disputas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_plataforma" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_plataforma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE INDEX "usuarios_correo_idx" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_token_key" ON "sesiones"("token");

-- CreateIndex
CREATE INDEX "sesiones_usuarioId_idx" ON "sesiones"("usuarioId");

-- CreateIndex
CREATE INDEX "sesiones_token_idx" ON "sesiones"("token");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_clientes_usuarioId_key" ON "perfiles_clientes"("usuarioId");

-- CreateIndex
CREATE INDEX "direcciones_perfilClienteId_idx" ON "direcciones"("perfilClienteId");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_trabajadores_usuarioId_key" ON "perfiles_trabajadores"("usuarioId");

-- CreateIndex
CREATE INDEX "documentos_trabajadores_perfilTrabajadorId_idx" ON "documentos_trabajadores"("perfilTrabajadorId");

-- CreateIndex
CREATE INDEX "disponibilidades_perfilTrabajadorId_idx" ON "disponibilidades"("perfilTrabajadorId");

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidades_perfilTrabajadorId_diaSemana_horaInicio_key" ON "disponibilidades"("perfilTrabajadorId", "diaSemana", "horaInicio");

-- CreateIndex
CREATE INDEX "zonas_servicio_perfilTrabajadorId_idx" ON "zonas_servicio"("perfilTrabajadorId");

-- CreateIndex
CREATE INDEX "solicitudes_servicio_perfilClienteId_idx" ON "solicitudes_servicio"("perfilClienteId");

-- CreateIndex
CREATE INDEX "solicitudes_servicio_fechaHora_idx" ON "solicitudes_servicio"("fechaHora");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_solicitudId_key" ON "reservas"("solicitudId");

-- CreateIndex
CREATE INDEX "reservas_perfilClienteId_idx" ON "reservas"("perfilClienteId");

-- CreateIndex
CREATE INDEX "reservas_perfilTrabajadorId_idx" ON "reservas"("perfilTrabajadorId");

-- CreateIndex
CREATE INDEX "reservas_estado_idx" ON "reservas"("estado");

-- CreateIndex
CREATE INDEX "reservas_fechaHora_idx" ON "reservas"("fechaHora");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_reservaId_key" ON "pagos"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_claveIdempotencia_key" ON "pagos"("claveIdempotencia");

-- CreateIndex
CREATE INDEX "pagos_estado_idx" ON "pagos"("estado");

-- CreateIndex
CREATE INDEX "pagos_claveIdempotencia_idx" ON "pagos"("claveIdempotencia");

-- CreateIndex
CREATE INDEX "resenas_reservaId_idx" ON "resenas"("reservaId");

-- CreateIndex
CREATE INDEX "resenas_paraTrabajadorId_idx" ON "resenas"("paraTrabajadorId");

-- CreateIndex
CREATE INDEX "suscripciones_premium_perfilTrabajadorId_idx" ON "suscripciones_premium"("perfilTrabajadorId");

-- CreateIndex
CREATE UNIQUE INDEX "disputas_reservaId_key" ON "disputas"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_plataforma_clave_key" ON "configuracion_plataforma"("clave");

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_clientes" ADD CONSTRAINT "perfiles_clientes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_perfilClienteId_fkey" FOREIGN KEY ("perfilClienteId") REFERENCES "perfiles_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_trabajadores" ADD CONSTRAINT "perfiles_trabajadores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_trabajadores" ADD CONSTRAINT "documentos_trabajadores_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "perfiles_trabajadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilidades" ADD CONSTRAINT "disponibilidades_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "perfiles_trabajadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas_servicio" ADD CONSTRAINT "zonas_servicio_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "perfiles_trabajadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_perfilClienteId_fkey" FOREIGN KEY ("perfilClienteId") REFERENCES "perfiles_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_perfilClienteId_fkey" FOREIGN KEY ("perfilClienteId") REFERENCES "perfiles_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "perfiles_trabajadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_desdeclienteId_fkey" FOREIGN KEY ("desdeclienteId") REFERENCES "perfiles_clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_paraClienteId_fkey" FOREIGN KEY ("paraClienteId") REFERENCES "perfiles_clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_desdeTrabajadorId_fkey" FOREIGN KEY ("desdeTrabajadorId") REFERENCES "perfiles_trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_paraTrabajadorId_fkey" FOREIGN KEY ("paraTrabajadorId") REFERENCES "perfiles_trabajadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones_premium" ADD CONSTRAINT "suscripciones_premium_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "perfiles_trabajadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputas" ADD CONSTRAINT "disputas_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
