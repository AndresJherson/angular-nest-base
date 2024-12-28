import { inject, Injectable } from '@angular/core';
import { ModalService } from './modal.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { LoaderComponent } from '../views/Components/Loader/Loader.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

    modalService = inject( ModalService );
    httpClient = inject( HttpClient );

    post<T>( body: HttpBody ): Observable<T>
    {
        return this.modalService.open( LoaderComponent, true ).pipe(
            switchMap( l => {

                const headers = new HttpHeaders({
                    'Content-Type': 'application/json'
                });

                console.log( 'request', body )
        
                return this.httpClient.post<T>( 'http://localhost:3000/api', body, {
                    headers,
                    withCredentials: true
                } )
                .pipe(
                    tap( data => console.log( 'response', data ) ),
                    catchError( error => {
                        console.log( error );
                        return throwError( () => error.statusText ?? error.message );
                    } ),
                    finalize( () => this.modalService.close( l ) ),
                );

            } )
        )
        
    }
}


export interface HttpBody
{
    service: string,
    method: string,
    values?: Record<string,any>
}


export interface HttpError
{
    error: string,
    message: string,
    statusCode: number
}


export interface HttpResult
{
    affectedRows: number
}