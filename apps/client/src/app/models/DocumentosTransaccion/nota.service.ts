import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ModalService } from '../../services/modal.service';
import { Nota } from '@app/models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

    serviceName = 'nota';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    createItem( nota: Nota )
    {
        return this.httpService.post<Nota>({
            service: this.serviceName,
            method: 'createItem',
            values: { nota }
        })
        .pipe( map( item => new Nota( item ) ) )
    }


    deleteItem( nota: Nota )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { nota }
        })
    }
}
