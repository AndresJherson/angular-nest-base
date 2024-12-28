import { inject, Injectable } from '@angular/core';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { HttpService } from 'apps/client/src/app/services/http.service';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { OverlayService } from 'apps/client/src/app/services/overlay.service';
import { StateRowTableComponent, TableComponent, TableComponentVm } from 'apps/client/src/app/views/CollectionComponents/Table/Table.component';
import { MessageBoxComponent } from 'apps/client/src/app/views/Components/MessageBox/MessageBox.component';
import { ObjectComponent, StateObjectComponent } from 'apps/client/src/app/views/ObjectComponents/Object/Object.component';
import { PantallaModeloCalidad } from 'apps/models/src/lib/ElementosEconomicos/Bien/Pantalla/PantallaModeloCalidad';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { map, tap } from 'rxjs';
import { PantallaModeloService } from './pantalla-modelo.service';
import { CalidadService } from './calidad.service';

@Injectable({
  providedIn: 'root'
})
export class PantallaModeloCalidadService {

    serviceName = 'pantallaModeoCalidad';
    httpService = inject( HttpService );
    modalService = inject( ModalService );
    pantallaModeloService = inject( PantallaModeloService );
    calidadService = inject( CalidadService );


    getCollection()
    {
        return this.httpService.post<PantallaModeloCalidad[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new PantallaModeloCalidad( item ) ) ) )
    }


    getItem( pantallaModeloCalidad: PantallaModeloCalidad )
    {
        return this.httpService.post<PantallaModeloCalidad>({
            service: this.serviceName,
            method: 'getItem',
            values: { pantallaModeloCalidad }
        })
        .pipe( map( item => new PantallaModeloCalidad( item ) ) )
    }


    createItem( pantallaModeloCalidad: PantallaModeloCalidad )
    {
        return this.httpService.post<PantallaModeloCalidad>({
            service: this.serviceName,
            method: 'createItem',
            values: { pantallaModeloCalidad }
        })
        .pipe( map( item => new PantallaModeloCalidad( item ) ) )
    }


    updateItem( pantallaModeloCalidad: PantallaModeloCalidad )
    {
        return this.httpService.post<PantallaModeloCalidad>({
            service: this.serviceName,
            method: 'updateItem',
            values: { pantallaModeloCalidad }
        })
        .pipe( map( item => new PantallaModeloCalidad( item ) ) )
    }


    deleteItem( pantallaModeloCalidad: PantallaModeloCalidad )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { pantallaModeloCalidad }
        })
    }


    tableBindingProperties: TableComponentVm<PantallaModeloCalidad>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
        { title: 'Modelo', getValue: item => item.nombre, behavior: PropBehavior.string },
        { title: 'Marca', getValue: item => item.pantallaModelo?.pantallaMarca?.nombre, behavior: PropBehavior.string },
        { title: 'Calidad', getValue: item => item.calidad?.nombre, behavior: PropBehavior.string },
        { title: 'Precio Uni.', getValue: item => item.precioUnitario, behavior: PropBehavior.number },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<PantallaModeloCalidad> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Pantallas',
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
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new PantallaModeloCalidad() ) )
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
        return this.modalService.open( TableComponent<PantallaModeloCalidad> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Pantallas',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<PantallaModeloCalidad[]>, store: ComponentStore<PantallaModeloCalidad> )
    {
        return this.modalService.open( ObjectComponent<PantallaModeloCalidad> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    title: 'Pantalla',
                    isCloseActive: true,
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
                        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
                        { title: 'Modelo', getValue: item => item.pantallaModelo?.nombre, setValue: ( item, value ) => item.set({ pantallaModelo: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.pantallaModeloService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( () =>
                                    item.pantallaModelo
                                    ? tc.setDataChecked([ item.pantallaModelo ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( pantalla => new PantallaModeloCalidad({
                                        ...pantalla,
                                        pantallaModelo: e.item
                                    }) )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( pantalla => new PantallaModeloCalidad({
                                        ...pantalla,
                                        pantallaModelo: e.item
                                    }) )
                                } ) );

                            } );
                        } },
                        { title: 'Marca', getValue: item => item.pantallaModelo?.pantallaMarca?.nombre, behavior: PropBehavior.string },
                        { title: 'Calidad', getValue: item => item.calidad?.nombre, setValue: ( item, value ) => item.set({ calidad: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.calidadService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( () =>
                                    item.calidad
                                    ? tc.setDataChecked([ item.calidad ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( pantalla => new PantallaModeloCalidad({
                                        ...pantalla,
                                        calidad: e.item
                                    }) );
                                } ) );
                                
                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( pantalla => new PantallaModeloCalidad({
                                        ...pantalla,
                                        calidad: e.item
                                    }) );
                                } ) );

                            } );
                        } },
                        { title: 'Precio Uni', getValue: item => item.precioUnitario, setValue: ( item, value ) => item.set({ precioUnitario: value }), required: true, behavior: PropBehavior.number },
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
