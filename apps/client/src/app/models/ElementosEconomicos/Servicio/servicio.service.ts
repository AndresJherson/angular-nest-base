import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ModalService } from '../../../services/modal.service';
import { Servicio } from '../../../../../../models/src/lib/ElementosEconomicos/Servicio/Servicio';
import { map, tap } from 'rxjs';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { OverlayService } from '../../../services/overlay.service';
import { ComponentStore } from '../../../services/ComponentStore';
import { ObjectComponent, StateObjectComponent } from '../../../views/ObjectComponents/Object/Object.component';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';
import { ServicioCategoriaService } from './servicio-categoria.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

    serviceName = 'servicio';
    httpService = inject( HttpService );
    modalService = inject( ModalService );
    servicioCategoriaService = inject( ServicioCategoriaService );


    getCollection()
    {
        return this.httpService.post<Servicio[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new Servicio( item ) ) ) )
    }


    getItem( servicio: Servicio )
    {
        return this.httpService.post<Servicio>({
            service: this.serviceName,
            method: 'getItem',
            values: { servicio }
        })
        .pipe( map( item => new Servicio( item ) ) )
    }


    createItem( servicio: Servicio )
    {
        return this.httpService.post<Servicio>({
            service: this.serviceName,
            method: 'createItem',
            values: { servicio }
        })
        .pipe( map( item => new Servicio( item ) ) )
    }


    updateItem( servicio: Servicio )
    {
        return this.httpService.post<Servicio>({
            service: this.serviceName,
            method: 'updateItem',
            values: { servicio }
        })
        .pipe( map( item => new Servicio( item ) ) )
    }


    deleteItem( servicio: Servicio )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { servicio }
        })
    }


    tableBindingProperties: TableComponentVm<Servicio>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
        { title: 'Categoria', getValue: item => item.servicioCategoria?.nombre, behavior: PropBehavior.string },
        { title: 'Precio Uni.', getValue: item => item.precioUnitario, behavior: PropBehavior.number },
        { title: 'Salida', getValue: item => item.esSalida ? 'Si' : 'No', behavior: PropBehavior.boolean },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<Servicio> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Servicios',
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
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new Servicio() ) )
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
        return this.modalService.open( TableComponent<Servicio> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Servicios',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<Servicio[]>, store: ComponentStore<Servicio> )
    {
        return this.modalService.open( ObjectComponent<Servicio> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    title: 'Servicio',
                    isCloseActive: true,
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
                        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Categoria', getValue: item => item.servicioCategoria?.nombre, setValue: ( item, value ) => item.set({ servicioCategoria: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.servicioCategoriaService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( () =>
                                    item.servicioCategoria
                                    ? tc.setDataChecked([ item.servicioCategoria ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( servicio => new Servicio({
                                        ...servicio,
                                        servicioCategoria: e.item
                                    }) );
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( servicio => new Servicio({
                                        ...servicio,
                                        servicioCategoria: e.item
                                    }) );
                                } ) );

                            } );
                        } },
                        { title: 'Precio Uni.', getValue: item => item.precioUnitario, setValue: ( item, value ) => item.set({ precioUnitario: value }), required: true, behavior: PropBehavior.number },
                        { title: 'Salida', getValue: ( item, obj ) => obj ? item.esSalida : ( item.esSalida ? 'Si' : 'No' ), setValue: ( item, value ) => item.set({ esSalida: value }), behavior: PropBehavior.boolean },
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
