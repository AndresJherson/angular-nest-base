import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, from, Observable, switchMap, tap, throwError } from 'rxjs';
import { ConectorService } from '../services/conector.service';
import { Request, Response} from 'express';
import { Transaction } from 'sequelize';
import { RequestTransaction } from '../interfaces/interfaces';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {

    constructor(
        private conectorService: ConectorService
    )
    {}


    intercept(context: ExecutionContext, next: CallHandler): Observable<any> 
    {
        return from( this.conectorService.transaction() ).pipe(
            switchMap( t => {

                const ctx = context.switchToHttp();
                const req: RequestTransaction = ctx.getRequest();
                const res: Response = ctx.getResponse();
                req.transaction = t;

                return next.handle().pipe(
                    tap( () => from( t.commit() ).subscribe() ),
                    catchError( error => {

                        return from( t.rollback() ).pipe(
                            switchMap( () => {
                                console.error( 'Error en transacciÓn:', error );
                                return throwError( () => error );
                            } )
                        )
                    } )
                )
            } )
        );
    }
}