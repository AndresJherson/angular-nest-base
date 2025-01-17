import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Empleado } from '../../../../../../models/src/lib/Personas/Empleado/Empleado';
import { map, tap } from 'rxjs';
import { OverlayService } from '../../../services/overlay.service';
import { StateRowTableComponent, TableComponent } from '../../../views/CollectionComponents/Table/Table.component';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { ComponentStore } from '../../../services/ComponentStore';
import { ModalService } from '../../../services/modal.service';
import { ObjectComponent, StateObjectComponent } from '../../../views/ObjectComponents/Object/Object.component';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';
import { DocumentoIdentificacionService } from '../documento-identificacion.service';
import { GeneroService } from '../genero.service';
import { UsuarioService } from '../Usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

    serviceName = 'empleado';
    httpService = inject( HttpService );
    modalService = inject( ModalService );
    documentoIdentificacionService = inject( DocumentoIdentificacionService );
    generoService = inject( GeneroService );
    usuarioService = inject( UsuarioService );


    getCollection()
    {
        return this.httpService.post<Empleado[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new Empleado( item ) ) ) )
    }


    getItem( empleado: Empleado )
    {
        return this.httpService.post<Empleado>({
            service: this.serviceName,
            method: 'getItem',
            values: { empleado }
        })
        .pipe( map( item => new Empleado( item ) ) )
    }


    createItem( empleado: Empleado )
    {
        return this.httpService.post<Empleado>({
            service: this.serviceName,
            method: 'createItem',
            values: { empleado }
        })
        .pipe( map( item => new Empleado( item ) ) )
    }


    updateItem( empleado: Empleado )
    {
        return this.httpService.post<Empleado>({
            service: this.serviceName,
            method: 'updateItem',
            values: { empleado }
        })
        .pipe( map( item => new Empleado( item ) ) )
    }


    deleteItem( empleado: Empleado )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { empleado }
        })
    }


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<Empleado> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Empleados',
                    stateRow: StateRowTableComponent.select,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Documento Id', getValue: item => item.documentoIdentificacion?.nombre, behavior: PropBehavior.string },
                        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
                        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
                        { title: 'Apellido', getValue: item => item.apellido, behavior: PropBehavior.string },
                        { title: 'Domicilio', getValue: item => item.domicilio, behavior: PropBehavior.string },
                        { title: 'Género', getValue: item => item.genero?.nombre, behavior: PropBehavior.string },
                        { title: 'Celular', getValue: item => item.celular, behavior: PropBehavior.number },
                        { title: 'Celular Respaldo', getValue: item => item.celularRespaldo, behavior: PropBehavior.number },
                        { title: 'Es técnico', getValue: item => item.esTecnico ? 'Si' : 'No', behavior: PropBehavior.string },
                        { title: 'Usuario', getValue: item => item.usuario?.usuario, behavior: PropBehavior.string }
                    ]
                });

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        c.recordActions.addItem
                    ]
                });

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

                c.sub.add( c.onAddItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new Empleado ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.create }) )
                ) );

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThisAsync( e.item, this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.read }) )
                ) );

            } )
        );
    }


    openObjectComponent( parentStore: ComponentStore<Empleado[]>, store: ComponentStore<Empleado> )
    {
        return this.modalService.open( ObjectComponent<Empleado> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Empleado',
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
                                    c.store.setState( empleado => new Empleado({
                                        ...empleado,
                                        documentoIdentificacion: e.item
                                    }) );
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( empleado => new Empleado({
                                        ...empleado,
                                        documentoIdentificacion: e.item
                                    }) )
                                } ) );

                            } );
                        } },
                        { title: 'Código', getValue: item => item.codigo, setValue: ( item, value ) => item.set({ codigo: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Apellido', getValue: item => item.apellido, setValue: ( item, value ) => item.set({ apellido: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Domicilio', getValue: item => item.domicilio, setValue: ( item, value ) => item.set({ domicilio: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Género', getValue: item => item.genero?.nombre, setValue: ( item, value ) => item.set({ genero: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.generoService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( state =>  
                                    item.genero
                                    ? tc.setDataChecked( [item.genero] )
                                    : undefined
                                ) )

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( empleado => new Empleado({
                                        ...empleado,
                                        genero: e.item
                                    }) )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( empleado => new Empleado({
                                        ...empleado,
                                        genero: e.item
                                    }) )
                                } ) );

                            } )
                        } },
                        { title: 'Celular', getValue: item => item.celular, setValue: ( item, value ) => item.set({ celular: value }), behavior: PropBehavior.number },
                        { title: 'Celular Respaldo', getValue: item => item.celularRespaldo, setValue: ( item, value ) => item.set({ celularRespaldo: value }), behavior: PropBehavior.number },
                        { title: 'Es Técnico', getValue: ( item, obj ) => obj ? item.esTecnico : ( item.esTecnico ? 'Si' : 'No' ), setValue: ( item, value ) => item.set({ esTecnico: value }), behavior: PropBehavior.boolean },
                        { title: 'Usuario', getValue: item => item.usuario?.usuario, setValue: ( item, value ) => item.set({ usuario: value }), behavior: PropBehavior.model, onClick: item => {
                            this.usuarioService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( state => 
                                    item.usuario
                                    ? tc.setDataChecked( [item.usuario] )
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( empleado => new Empleado({
                                        ...empleado,
                                        usuario: e.item
                                    }) )
                                } ) )

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( empleado => new Empleado({
                                        ...empleado,
                                        usuario: e.item
                                    }) )
                                } ) );

                            } );
                        } }
                    ]
                });


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
