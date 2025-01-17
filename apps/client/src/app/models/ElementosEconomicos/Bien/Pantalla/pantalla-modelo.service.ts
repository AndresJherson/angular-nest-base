import { inject, Injectable } from '@angular/core';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { HttpService } from 'apps/client/src/app/services/http.service';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { OverlayService } from 'apps/client/src/app/services/overlay.service';
import { StateRowTableComponent, TableComponent, TableComponentVm } from 'apps/client/src/app/views/CollectionComponents/Table/Table.component';
import { MessageBoxComponent } from 'apps/client/src/app/views/Components/MessageBox/MessageBox.component';
import { ObjectComponent, StateObjectComponent } from 'apps/client/src/app/views/ObjectComponents/Object/Object.component';
import { PantallaModelo } from 'apps/models/src/lib/ElementosEconomicos/Bien/Pantalla/PantallaModelo';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { map, tap } from 'rxjs';
import { PantallaMarcaService } from './pantalla-marca.service';

@Injectable({
  providedIn: 'root'
})
export class PantallaModeloService {

    serviceName = 'pantallaModelo';
    httpService = inject( HttpService );
    modalService = inject( ModalService );
    pantallaMarcaService = inject( PantallaMarcaService );


    getCollection()
    {
        return this.httpService.post<PantallaModelo[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new PantallaModelo( item ) ) ) )
    }


    getItem( pantallaModelo: PantallaModelo )
    {
        return this.httpService.post<PantallaModelo>({
            service: this.serviceName,
            method: 'getItem',
            values: { pantallaModelo }
        })
        .pipe( map( item => new PantallaModelo( item ) ) )
    }


    createItem( pantallaModelo: PantallaModelo )
    {
        return this.httpService.post<PantallaModelo>({
            service: this.serviceName,
            method: 'createItem',
            values: { pantallaModelo }
        })
        .pipe( map( item => new PantallaModelo( item ) ) )
    }


    updateItem( pantallaModelo: PantallaModelo )
    {
        return this.httpService.post<PantallaModelo>({
            service: this.serviceName,
            method: 'updateItem',
            values: { pantallaModelo }
        })
        .pipe( map( item => new PantallaModelo( item ) ) )
    }


    deleteItem( pantallaModelo: PantallaModelo )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { pantallaModelo }
        })
    }


    tableBindingProperties: TableComponentVm<PantallaModelo>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
        { title: 'Marca', getValue: item => item.pantallaMarca?.nombre, behavior: PropBehavior.string },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<PantallaModelo> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Modelos de Pantalla',
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
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new PantallaModelo() ) )
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
        return this.modalService.open( TableComponent<PantallaModelo> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Modelos de Pantalla',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<PantallaModelo[]>, store: ComponentStore<PantallaModelo> )
    {
        return this.modalService.open( ObjectComponent<PantallaModelo> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Modelo de Pantalla',
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Marca', getValue: item => item.pantallaMarca?.nombre, setValue: ( item, value ) => item.set({ pantallaMarca: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.pantallaMarcaService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( () => 
                                    item.pantallaMarca
                                    ? tc.setDataChecked([ item.pantallaMarca ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( pantallaModelo => new PantallaModelo({
                                        ...pantallaModelo,
                                        pantallaMarca: e.item
                                    }) )
                                } ) );
                                
                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( pantallaModelo => new PantallaModelo({
                                        ...pantallaModelo,
                                        pantallaMarca: e.item
                                    }) )
                                } ) );

                            } )
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
