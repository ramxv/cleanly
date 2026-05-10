import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
    constructor(
        public readonly errorCode: string,
        public readonly message: string,
        public readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    ){
        super({message, errorCode}, statusCode);
    }
}