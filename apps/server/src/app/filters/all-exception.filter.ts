import { Prop } from '@app/models';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ErrorModel } from 'apps/models/src/lib/utils/ErrorModel';
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

        const message = exception instanceof ErrorModel
                            ? exception.getAllMessages()
                        : exception instanceof HttpException
                            ? exception.message
                        : Prop.setString( (exception as any).message ) !== undefined 
                            ? Prop.setString( (exception as any).message )
                            : 'Internal Server Error';
        
        console.error( 'tipo de excepcion en el filtro:', typeof exception, exception )
        console.error( 'Excepción capturada en el filtro: ', message );


        response.status( status )
            .statusMessage = String( message );

        response.json({
            statusCode: status,
            message: String( message )
        });
    }
}
