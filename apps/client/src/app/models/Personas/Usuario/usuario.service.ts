import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Usuario } from 'apps/models/src/lib/Personas/Usuario/Usuario';
import { map, of, tap } from 'rxjs';
import { OverlayService } from '../../../services/overlay.service';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { ModalService } from '../../../services/modal.service';
import { ComponentStore } from '../../../services/ComponentStore';
import { ObjectComponent, StateObjectComponent } from '../../../views/ObjectComponents/Object/Object.component';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    serviceName = 'usuario';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<Usuario[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new Usuario( item ) ) ) )
    }


    getItem( usuario: Usuario )
    {
        return this.httpService.post<Usuario>({
            service: this.serviceName,
            method: 'getItem',
            values: { usuario }
        })
        .pipe( map( item => new Usuario( item ) ) )
    }


    createItem( usuario: Usuario )
    {
        return this.httpService.post<Usuario>({
            service: this.serviceName,
            method: 'createItem',
            values: { usuario }
        })
        .pipe( map( item => new Usuario( item ) ) )
    }


    updateItem( usuario: Usuario )
    {
        return this.httpService.post<Usuario>({
            service: this.serviceName,
            method: 'updateItem',
            values: { usuario }
        })
        .pipe( map( item => new Usuario( item ) ) )
    }


    deleteItem( usuario: Usuario )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { usuario }
        })
    }


    tableBindingProperties: TableComponentVm<Usuario>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
        { title: 'Usuario', getValue: item => item.usuario, behavior: PropBehavior.string },
        { title: 'Activo', getValue: item => item.esActivo ? 'Sí' : 'No', behavior: PropBehavior.boolean },
    ]


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<Usuario> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Usuarios',
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
                    this.openObjectComponent( c.store, c.store.storeFromThisAsync( new Usuario(), of( new Usuario() ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.create }) )
                ) );

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThisAsync( new Usuario(), this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.read }) )
                ) );

            } )
        );
    }


    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<Usuario> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Usuarios',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<Usuario[]>, store: ComponentStore<Usuario> )
    {
        return this.modalService.open( ObjectComponent<Usuario> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    title: 'Usuario',
                    isCloseActive: true,
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Usuario', getValue: item => item.usuario, setValue: ( item, value ) => item.set({ usuario: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Contraseña', setValue: ( item, value ) => item.set({ contrasena: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Activo', getValue: ( item, obj ) => obj ? item.esActivo : ( item.esActivo ? 'Sí' : 'No' ), setValue: ( item, value ) => item.set({ esActivo: value }), behavior: PropBehavior.boolean },
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
