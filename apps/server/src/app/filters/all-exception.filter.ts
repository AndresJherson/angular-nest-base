import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) 
    {
        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse();

        const status = exception instanceof HttpException
                        ? exception.getStatus()
                        : 500;

        const message = exception instanceof HttpException
                        ? exception.message
                        : 'Internal Server Error';
        
        console.error( 'Excepción capturada en el filtro: ', message );

        response.status( status )
            .statusMessage = String( message );

        response.json({
            statusCode: status,
            message: String( message )
        });
    }
}
