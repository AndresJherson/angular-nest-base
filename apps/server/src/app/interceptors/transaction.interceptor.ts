import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, from, Observable, switchMap, tap, throwError } from 'rxjs';
import { ConectorService } from '../services/conector.service';
import { Request, Response } from 'express';
import { SessionData } from '../interfaces/interfaces';
import { UsuarioService } from '../models/Personas/Usuario/usuario.service';
import { SessionService } from '../services/session.service';
import { Prop, Usuario } from '@app/models';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {

    constructor(
        private conectorService: ConectorService,
        private sessionService: SessionService,
        private usuarioService: UsuarioService,
    )
    {}


    intercept(context: ExecutionContext, next: CallHandler): Observable<any> 
    {
        return from( this.conectorService.transaction() ).pipe(
            switchMap( t => {

                const ctx = context.switchToHttp();
                const req: Request = ctx.getRequest();
                const res: Response = ctx.getResponse();

                const service = Prop.setString( req.body.service ) ?? '';
                const method = Prop.setString( req.body.method ) ?? '';
                const json: Record<string,any> = typeof req.body.values === 'object'
                                                    ? req.body.values
                                                    : {};
    
                const s: SessionData = {
                    req,
                    res,
                    service,
                    method,
                    json,
                    usuario: new Usuario(),
                    transaction: t,
                }

                return from( this.usuarioService.getItem( s, new Usuario({ id: 0 }) ) ).pipe(
                    switchMap( usuario => {

                        s.usuario = usuario;
                        this.sessionService.sessionData = s;

                        return next.handle().pipe(
                            tap( () => from( t.commit() ).subscribe() ),
                            catchError( error => {
        
                                return from( t.rollback() ).pipe(
                                    switchMap( () => {
                                        console.error( 'Error en transacciÓn:', error );
                                        console.error( 'Mensaje de error en transacción:', error.message )
                                        return throwError( () => new InternalServerErrorException( error.message ) );
                                    } )
                                )
                            } )
                        )

                    } )
                )
            } )
        );
    }
}