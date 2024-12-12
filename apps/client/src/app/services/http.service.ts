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
        console.log(body.values)
        return this.modalService.open( LoaderComponent, false ).pipe(
            switchMap( l => {

                const headers = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
        
                return this.httpClient.post<T>( 'http://localhost:3000/api', body, {
                    headers,
                    withCredentials: true
                } )
                .pipe(
                    tap( v => console.log( v ) ),
                    catchError( error => {
                        console.log( error );
                        return throwError( () => error );
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