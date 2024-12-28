import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ElementoEconomico } from 'apps/models/src/lib/ElementosEconomicos/ElementoEconomico';
import { map, switchMap, tap } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { ObjectComponent, StateObjectComponent } from '../../views/ObjectComponents/Object/Object.component';
import { PropBehavior } from 'apps/models/src/lib/Model';

@Injectable({
  providedIn: 'root'
})
export class ElementoEconomicoService {

    serviceName = 'elementoEconomico';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<ElementoEconomico[]>({
            service: this.serviceName,
            method: 'getCollection'
        })
        .pipe( map( data => data.map( item => new ElementoEconomico( item ) ) ) )
    }


    getItemPorCodigo( elementoEconomico: ElementoEconomico )
    {
        return this.httpService.post<ElementoEconomico>({
            service: this.serviceName,
            method: 'getItemPorCodigo',
            values: { elementoEconomico }
        })
        .pipe( map( item => new ElementoEconomico( item ) ) );
    }


    objectComponentPorCodigo( elementoEconomico: ElementoEconomico )
    {
        return this.getItemPorCodigo( elementoEconomico ).pipe(
            switchMap( itemElementoEconomico => 

                this.modalService.open( ObjectComponent<ElementoEconomico> ).pipe(
                    tap( c => {

                        c.store.setRead( this.getItemPorCodigo( itemElementoEconomico ) )
                                .setState( itemElementoEconomico );
    
                        c.vm$.next({
                            title: 'Elemento Económico',
                            state: StateObjectComponent.create,
                            isCloseActive: true,
                            bindingProperties: [
                                { title: 'Código', getValue: item => item.codigo, readonly: true, behavior: PropBehavior.string },
                                { title: 'Nombre', getValue: item => `${item.nombre ?? ''} ${item.magnitudNombre ?? ''}`, readonly: true, behavior: PropBehavior.string },
                                { title: 'Categoria', getValue: item => item.categoria, readonly: true, behavior: PropBehavior.string },
                                { title: 'Precio Uni.', getValue: item => item.precioUnitario, readonly: true, behavior: PropBehavior.number },
                            ]
                        });
    
                    } )
                )

            )
        )
    }
}
