
// src/common/exceptions/database.exceptions.ts
import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

// Cuando la entidad ya existe
export class EntityAlreadyExistsException extends ApiException {
  constructor(entity: string, detail?: string) {
    super(
      `${entity.toUpperCase()}_ALREADY_EXISTS`,
      detail || `El/la ${entity} ya existe en el sistema.`,
      HttpStatus.CONFLICT, // 409
    );
  }
}

// Cuando una entidad no existe (Recomendado por la imagen)
export class EntityNotFoundException extends ApiException {
  constructor(entity: string) {
    super(
      `${entity.toUpperCase()}_NOT_FOUND`,
      `${entity} no encontrado/a en el sistema.`,
      HttpStatus.NOT_FOUND, // 404
    );
  }
}

// Violación de llave foránea genérica basada en la entidad
export class EntityReferenceNotFoundException extends ApiException {
  constructor(entity: string) {
    super(
      `${entity.toUpperCase()}_REFERENCE_NOT_FOUND`,
      `No se pudo completar la operación porque la entidad relacionada (${entity}) no existe o no es válida.`,
      HttpStatus.BAD_REQUEST, // 400
    );
  }
}

// Cuando una entidad viola una restricción de unicidad (genérico para atributos)
export class EntityUniqueConstraintException extends ApiException {
  constructor(entity: string, field: string) {
    super(
      `${entity.toUpperCase()}_UNIQUE_VIOLATION`,
      `El valor proporcionado para el campo '${field}' de ${entity} ya está en uso.`,
      HttpStatus.CONFLICT, // 409
    );
  }
}

// Error de conexión o Timeout con la base de datos
export class DatabaseConnectionException extends ApiException {
  constructor() {
    super(
      'DATABASE_CONNECTION_ERROR',
      'Ocurrió un error al intentar conectar con la base de datos. Intente nuevamente más tarde.',
      HttpStatus.INTERNAL_SERVER_ERROR, // 500
    );
  }
}