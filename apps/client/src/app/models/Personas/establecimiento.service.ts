import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Establecimiento } from 'apps/models/src/lib/Personas/Establecimiento';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientoService {

    serviceName = 'establecimiento';
    httpService = inject( HttpService );


    getItem()
    {
        return this.httpService.post<Establecimiento>({
            service: this.serviceName,
            method: 'getItem'
        })
        .pipe( map( item => new Establecimiento( item ) ) )
    }


    updateItem( establecimiento: Establecimiento )
    {
        return this.httpService.post<Establecimiento>({
            service: this.serviceName,
            method: 'updateItem',
            values: { establecimiento }
        })
        .pipe( map( item => new Establecimiento( item ) ) )
    }
}
