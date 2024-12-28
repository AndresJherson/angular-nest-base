import { inject, Injectable } from '@angular/core';
import { DocumentoIdentificacion } from 'apps/models/src/lib/Personas/DocumentoIdentificacion';
import { map, of, tap } from 'rxjs';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { HttpService } from '../../services/http.service';
import { ModalService } from '../../services/modal.service';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../views/CollectionComponents/Table/Table.component';
import { OverlayService } from '../../services/overlay.service';
import { ComponentStore } from '../../services/ComponentStore';
import { ObjectComponent, StateObjectComponent } from '../../views/ObjectComponents/Object/Object.component';
import { MessageBoxComponent } from '../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class DocumentoIdentificacionService {

    serviceName = 'documentoIdentificacion';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<DocumentoIdentificacion[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new DocumentoIdentificacion( item ) ) ) )
    }


    getItem( documentoIdentificacion: DocumentoIdentificacion )
    {
        return this.httpService.post<DocumentoIdentificacion>({
            service: this.serviceName,
            method: 'getItem',
            values: { documentoIdentificacion }
        })
        .pipe( map( item => new DocumentoIdentificacion( item ) ) )
    }


    createItem( documentoIdentificacion: DocumentoIdentificacion )
    {
        return this.httpService.post<DocumentoIdentificacion>({
            service: this.serviceName,
            method: 'createItem',
            values: { documentoIdentificacion }
        })
        .pipe( map( item => new DocumentoIdentificacion( item ) ) )
    }


    updateItem( documentoIdentificacion: DocumentoIdentificacion )
    {
        return this.httpService.post<DocumentoIdentificacion>({
            service: this.serviceName,
            method: 'updateItem',
            values: { documentoIdentificacion }
        })
        .pipe( map( item => new DocumentoIdentificacion( item ) ) )
    }


    deleteItem( documentoIdentificacion: DocumentoIdentificacion )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { documentoIdentificacion }
        })
    }


    tableBindingProperties: TableComponentVm<DocumentoIdentificacion>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<DocumentoIdentificacion> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Documentos de Identificación',
                    stateRow: StateRowTableComponent.select,
                    bindingProperties: this.tableBindingProperties
                });

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        c.recordActions.addItem
                    ]
                });

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThisAsync( e.item, this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.read }) )
                ) );

                c.sub.add( c.onAddItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThisAsync( new DocumentoIdentificacion, of( new DocumentoIdentificacion() ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.create }) )
                ) );

            } )
        );
    }
    

    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<DocumentoIdentificacion> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Documentos de Identificación',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<DocumentoIdentificacion[]>, store: ComponentStore<DocumentoIdentificacion> )
    {
        return this.modalService.open( ObjectComponent<DocumentoIdentificacion> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    title: 'Género',
                    isCloseActive: true,
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
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
