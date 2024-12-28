import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { map, tap } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { Cliente } from 'apps/models/src/lib/Personas/Cliente/Cliente';
import { OverlayService } from '../../../services/overlay.service';
import { ClienteComponent } from '../../../views/ObjectComponents/Personas/Cliente/Cliente.component';
import { ComponentStore } from '../../../services/ComponentStore';
import { ObjectComponent, StateObjectComponent } from '../../../views/ObjectComponents/Object/Object.component';
import { DocumentoIdentificacionService } from '../documento-identificacion.service';
import { GeneroService } from '../genero.service';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

    serviceName = 'cliente';
    httpService = inject( HttpService );
    modalService = inject( ModalService );
    documentoIdentificacionService = inject( DocumentoIdentificacionService );
    generoService = inject( GeneroService );


    getCollection()
    {
        return this.httpService.post<Cliente[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new Cliente( item ) ) ) )
    }


    getItem( cliente: Cliente )
    {
        return this.httpService.post<Cliente>({
            service: this.serviceName,
            method: 'getItem',
            values: { cliente }
        })
        .pipe( map( item => new Cliente( item ) ) )
    }


    createItem( cliente: Cliente )
    {
        return this.httpService.post<Cliente>({
            service: this.serviceName,
            method: 'createItem',
            values: { cliente }
        })
        .pipe( map( item => new Cliente( item ) ) )
    }


    updateItem( cliente: Cliente )
    {
        return this.httpService.post<Cliente>({
            service: this.serviceName,
            method: 'updateItem',
            values: { cliente }
        })
        .pipe( map( item => new Cliente( item ) ) )
    }


    deleteItem( cliente: Cliente )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { cliente }
        })
    }


    tableBindingProperties: TableComponentVm<Cliente>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Documento Id', getValue: item => item.documentoIdentificacion?.nombre, behavior: PropBehavior.string },
        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
        { title: 'Apellido', getValue: item => item.apellido, behavior: PropBehavior.string },
        { title: 'Género', getValue: item => item.genero?.nombre, behavior: PropBehavior.string },
        { title: 'Celular', getValue: item => item.celular, behavior: PropBehavior.string },
        { title: 'Celular Respaldo', getValue: item => item.celularRespaldo, behavior: PropBehavior.string },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<Cliente> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Clientes',
                    stateRow: StateRowTableComponent.select,
                    bindingProperties: this.tableBindingProperties
                });

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        c.recordActions.addItem
                    ]
                });

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

                c.sub.add( c.onSelectItem.subscribe( e => {
                    this.openClienteComponent( c.store.storeFromThis( () => e.item ), overlayService )
                    .subscribe();
                } ) );

                c.sub.add( c.onAddItem.subscribe( e => {
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new Cliente() ), overlayService )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.create }) )
                } ) );

            } )
        );
    }


    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<Cliente> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe()


                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Clientes',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                })                

            } )
        )
    }    


    openClienteComponent( store: ComponentStore<Cliente>, overlayService: OverlayService )
    {
        return overlayService.open( ClienteComponent ).pipe(
            tap( c => {

                c.storeCliente = store;

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

            } )
        );
    }


    openObjectComponent( parentStore: ComponentStore<Cliente[]>, store: ComponentStore<Cliente>, overlayService?: OverlayService )
    {
        return this.modalService.open( ObjectComponent<Cliente> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    title: 'Cliente',
                    isCloseActive: true,
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Documento Id', getValue: item => item.documentoIdentificacion?.nombre, setValue: ( item, value ) => item.set({ documentoIdentificacion: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.documentoIdentificacionService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( state => 
                                    item.documentoIdentificacion 
                                    ? tc.setDataChecked( [item.documentoIdentificacion] ) 
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( cliente => new Cliente({
                                        ...cliente,
                                        documentoIdentificacion: e.item
                                    }) );
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( cliente => new Cliente({
                                        ...cliente,
                                        documentoIdentificacion: e.item
                                    }) )
                                } ) );

                            } );
                        } },
                        { title: 'Código', getValue: item => item.codigo, setValue: ( item, value ) => item.set({ codigo: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Apellido', getValue: item => item.apellido, setValue: ( item, value ) => item.set({ apellido: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Género', getValue: item => item.genero?.nombre, setValue: ( item, value ) => item.set({ genero: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.generoService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( state =>  
                                    item.genero
                                    ? tc.setDataChecked( [item.genero] )
                                    : undefined
                                ) )

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( cliente => new Cliente({
                                        ...cliente,
                                        genero: e.item
                                    }) )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( cliente => new Cliente({
                                        ...cliente,
                                        genero: e.item
                                    }) )
                                } ) );

                            } )
                        } },
                        { title: 'Celular', getValue: item => item.celular, setValue: ( item, value ) => item.set({ celular: value }), behavior: PropBehavior.number },
                        { title: 'Celular Respaldo', getValue: item => item.celularRespaldo, setValue: ( item, value ) => item.set({ celularRespaldo: value }), behavior: PropBehavior.number },
                    ]
                });


                c.sub.add( c.onCreate.subscribe( e => {

                    this.createItem( e.item ).subscribe({
                        next: item => {

                            c.close( e.event );
                            c.sub.add( c.store.state$.subscribe({
                                complete: () => parentStore.getRead().subscribe({
                                    next: () => {
                                        if ( overlayService )
                                            this.openClienteComponent( parentStore.storeFromThis( () => item ), overlayService )
                                            .subscribe()
                                    }
                                })
                            }) );

                            setTimeout( () => parentStore.getRead().subscribe(), 3000 );

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

            } )
        );
    }
}
