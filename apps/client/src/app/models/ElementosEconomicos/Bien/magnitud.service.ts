import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Magnitud } from 'apps/models/src/lib/ElementosEconomicos/Bien/Magnitud';
import { map, tap } from 'rxjs';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { OverlayService } from '../../../services/overlay.service';
import { ModalService } from '../../../services/modal.service';
import { ComponentStore } from '../../../services/ComponentStore';
import { ObjectComponent, StateObjectComponent } from '../../../views/ObjectComponents/Object/Object.component';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';
import { MagnitudTipoService } from './magnitud-tipo.service';

@Injectable({
  providedIn: 'root'
})
export class MagnitudService {

    serviceName = 'magnitud';
    httpService = inject( HttpService );
    modalService = inject( ModalService );
    magnitudTipoService = inject( MagnitudTipoService );


    getCollection()
    {
        return this.httpService.post<Magnitud[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new Magnitud( item ) ) ) )
    }


    getItem( magnitud: Magnitud )
    {
        return this.httpService.post<Magnitud>({
            service: this.serviceName,
            method: 'getItem',
            values: { magnitud }
        })
        .pipe( map( item => new Magnitud( item ) ) )
    }


    createItem( magnitud: Magnitud )
    {
        return this.httpService.post<Magnitud>({
            service: this.serviceName,
            method: 'createItem',
            values: { magnitud }
        })
        .pipe( map( item => new Magnitud( item ) ) )
    }


    updateItem( magnitud: Magnitud )
    {
        return this.httpService.post<Magnitud>({
            service: this.serviceName,
            method: 'updateItem',
            values: { magnitud }
        })
        .pipe( map( item => new Magnitud( item ) ) )
    }


    deleteItem( magnitud: Magnitud )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { magnitud }
        })
    }


    tableBindingProperties: TableComponentVm<Magnitud>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
        { title: 'Tipo', getValue: item => item.magnitudTipo?.nombre, behavior: PropBehavior.string },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<Magnitud> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Magnitudes',
                    stateRow: StateRowTableComponent.select,
                    bindingProperties: this.tableBindingProperties
                });

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        c.recordActions.addItem
                    ]
                });

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

                c.sub.add( c.onAddItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new Magnitud() ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.create }) )
                ) );

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThisAsync( e.item, this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.read }) )
                ) );

            } )
        );
    }
    

    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<Magnitud> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Magnitudes',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<Magnitud[]>, store: ComponentStore<Magnitud> )
    {
        return this.modalService.open( ObjectComponent<Magnitud> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Magnitud',
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Tipo', getValue: item => item.magnitudTipo?.nombre, setValue: ( item, value ) => item.set({ magnitudTipo: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.magnitudTipoService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( () => 
                                    item.magnitudTipo
                                    ? tc.setDataChecked([ item.magnitudTipo ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( magnitud => new Magnitud({
                                        ...magnitud,
                                        magnitudTipo: e.item
                                    }) )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( magnitud => new Magnitud({
                                        ...magnitud,
                                        magnitudTipo: e.item
                                    }) )
                                }) );

                            } );
                        } },
                    ]
                });

                
                c.sub.add( c.onCreate.subscribe( e => {

                    this.createItem( e.item ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, state: StateObjectComponent.read });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onUpdate.subscribe( e => {

                    this.updateItem( e.item ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, state: StateObjectComponent.read });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onDelete.subscribe( e => {

                    this.deleteItem( e.item ).subscribe({
                        next: () => {
                            c.close( e.event );
                            parentStore.getRead().subscribe();
                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

            } )
        );
    }
}
