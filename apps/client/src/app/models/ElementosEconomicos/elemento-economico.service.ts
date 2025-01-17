import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ElementoEconomico } from 'apps/models/src/lib/ElementosEconomicos/ElementoEconomico';
import { map, switchMap, tap } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { ObjectComponent, StateObjectComponent } from '../../views/ObjectComponents/Object/Object.component';
import { Prop, PropBehavior } from '@app/models';
import { StateRowTableComponent, TableComponent } from '../../views/CollectionComponents/Table/Table.component';

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


    getCollectionType( )
    {
        return this.httpService.post<ElementoEconomico[]>({
            service: this.serviceName,
            method: 'getCollectionType'
        })
        .pipe( map( data => ElementoEconomico.initialize( data ) ) )
    }


    getCollectionEsSalida()
    {
        return this.httpService.post<ElementoEconomico[]>({
            service: this.serviceName,
            method: 'getCollectionEsSalida'
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
                            ...c.vm$.value,
                            title: 'Elemento Económico',
                            state: StateObjectComponent.create,
                            bindingProperties: [
                                { title: 'Código', getValue: item => item.codigo, readonly: true, behavior: PropBehavior.string },
                                { title: 'Nombre', getValue: item => `${item.nombre ?? ''} ${item.magnitudNombre ?? ''}`, readonly: true, behavior: PropBehavior.string },
                                { title: 'Categoria', getValue: item => item.categoriaNombre, readonly: true, behavior: PropBehavior.string },
                                { 
                                    title: 'Precio Uni.', 
                                    getValue: ( item, original ) => 
                                        original
                                            ? item.precioUnitario
                                            : Prop.toDecimal( item.precioUnitario ).toFixed( 2 ), 
                                    readonly: true, 
                                    behavior: PropBehavior.number 
                                },
                            ]
                        });
    
                    } )
                )

            )
        )
    }


    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<ElementoEconomico> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollectionEsSalida() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Productos y Servicios',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Codigo', getValue: item => item.codigo, behavior: PropBehavior.string },
                        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
                        { title: 'Magnitud', getValue: item => item.magnitudNombre, behavior: PropBehavior.string },
                        { title: 'Categoria', getValue: item => item.categoriaNombre, behavior: PropBehavior.string },
                        { title: 'Precio Uni.', getValue: item => Prop.toDecimal( item.precioUnitario ).toFixed( 2 ), behavior: PropBehavior.number },
                    ]
                });

            } )
        )
    }
}
