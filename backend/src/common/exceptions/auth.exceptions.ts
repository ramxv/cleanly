
import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

// Cuando el usuario no tiene permisos para acceder a un recurso o realizar una acción
export class InvalidCredentialsException extends ApiException {
  constructor() {
    super(
      'INVALID_CREDENTIALS',
      'El correo o la contraseña son incorrectos.',
      HttpStatus.UNAUTHORIZED, // 401
    );
  }
}

export class TokenExpiredException extends ApiException {
  constructor() {
    super(
      'TOKEN_EXPIRED',
      'La sesión ha expirado, por favor inicia sesión nuevamente.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidTokenException extends ApiException {
  constructor() {
    super(
      'INVALID_TOKEN',
      'El token de acceso provisto no es válido o está corrupto.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InsufficientPermissionsException extends ApiException {
  constructor() {
    super(
      'INSUFFICIENT_PERMISSIONS',
      'No tienes los permisos necesarios para realizar esta acción.',
      HttpStatus.FORBIDDEN, // 403
    );
  }
}

export class AccountSuspendedException extends ApiException {
  constructor() {
    super(
      'ACCOUNT_SUSPENDED',
      'Tu cuenta ha sido suspendida. Por favor contacta a soporte técnico.',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class EmailNotVerifiedException extends ApiException {
  constructor() {
    super(
      'EMAIL_NOT_VERIFIED',
      'Debes verificar tu correo electrónico para realizar esta acción.',
      HttpStatus.FORBIDDEN,
    );
  }
}