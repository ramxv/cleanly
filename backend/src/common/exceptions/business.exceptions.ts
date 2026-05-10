// src/common/exceptions/business.exceptions.ts
import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

//Saldos insuficientes para realizar una operación (ej: Pago, Retiro, etc)
export class InsufficientFundsException extends ApiException {
  constructor() {
    super(
      'INSUFFICIENT_FUNDS',
      'No tienes saldo suficiente para realizar esta operación.',
      HttpStatus.UNPROCESSABLE_ENTITY, // 422
    );
  }
}

// Cuando se viola una regla de negocio específica (ej: Intentar cancelar un servicio que ya ha sido completado)
export class BusinessRuleException extends ApiException {
  constructor(message: string, code: string = 'BUSINESS_RULE_VIOLATION') {
    super(code, message, HttpStatus.BAD_REQUEST);
  }
}

// Reservas (Bookings) 
export class BookingAlreadyCompletedException extends ApiException {
  constructor() {
    super(
      'BOOKING_ALREADY_COMPLETED',
      'No se puede modificar una reserva que ya ha sido completada.',
      HttpStatus.CONFLICT,
    );
  }
}

export class WorkerNotAvailableException extends ApiException {
  constructor() {
    super(
      'WORKER_NOT_AVAILABLE',
      'El profesional de limpieza seleccionado no está disponible en este horario.',
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidScheduleException extends ApiException {
  constructor() {
    super(
      'INVALID_SCHEDULE',
      'El horario seleccionado para la limpieza no es válido o está fuera de las horas de servicio.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ServiceNotProvidedInAreaException extends ApiException {
  constructor() {
    super(
      'SERVICE_NOT_PROVIDED_IN_AREA',
      'Actualmente no brindamos servicios de limpieza en esta zona.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

// Reseñas (Reviews)
export class ReviewAlreadyExistsException extends ApiException {
  constructor() {
    super(
      'REVIEW_ALREADY_EXISTS',
      'Ya has dejado una reseña para este servicio.',
      HttpStatus.CONFLICT,
    );
  }
}