
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false, description: 'Indica si la petición fue exitosa' })
  success!: boolean;

  @ApiProperty({ example: 'VALIDATION_ERROR', description: 'Código interno del error' })
  errorCode!: string;

  @ApiProperty({ 
    example: 'Email ya está en uso', 
    description: 'Mensaje descriptivo del error o arreglo de errores de validación',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } }
    ]
  })
  message!: string | string[];

  @ApiProperty({ example: '/api/v1/auth/register', description: 'Ruta donde ocurrió el error' })
  path!: string;

  @ApiProperty({ example: '2026-05-10T22:24:35.000Z', description: 'Fecha y hora del error' })
  timestamp!: string;
}