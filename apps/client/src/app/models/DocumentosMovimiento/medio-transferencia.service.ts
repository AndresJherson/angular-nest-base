import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { map, tap } from 'rxjs';
import { MedioTransferencia, PropBehavior } from '@app/models';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../views/CollectionComponents/Table/Table.component';
import { OverlayService } from '../../services/overlay.service';
import { ObjectComponent, StateObjectComponent } from '../../views/ObjectComponents/Object/Object.component';
import { ModalService } from '../../services/modal.service';
import { ComponentStore } from '../../services/ComponentStore';
import { MessageBoxComponent } from '../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class MedioTransferenciaService {

    serviceName = 'medioTransferencia';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<MedioTransferencia[]>({
            service: this.serviceName,
            method: 'getCollection'
        })
        .pipe( map( data => data.map( item => new MedioTransferencia( item ) ) ) )
    }


    getItem( medioTransferencia: MedioTransferencia )
    {
        return this.httpService.post<MedioTransferencia>({
            service: this.serviceName,
            method: 'getItem',
            values: { medioTransferencia }
        })
        .pipe( map( item => new MedioTransferencia( item ) ) )
    }


    createItem( medioTransferencia: MedioTransferencia )
    {
        return this.httpService.post<MedioTransferencia>({
            service: this.serviceName,
            method: 'createItem',
            values: { medioTransferencia }
        })
        .pipe( map( item => new MedioTransferencia( item ) ) )
    }


    updateItem( medioTransferencia: MedioTransferencia )
    {
        return this.httpService.post<MedioTransferencia>({
            service: this.serviceName,
            method: 'updateItem',
            values: { medioTransferencia }
        })
        .pipe( map( item => new MedioTransferencia( item ) ) )
    }


    deleteItem( medioTransferencia: MedioTransferencia )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { medioTransferencia }
        })
    }
    

    tableBindingProperties: TableComponentVm<MedioTransferencia>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
    ]


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<MedioTransferencia> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Medios de Transferencia',
                    stateRow: StateRowTableComponent.select,
                    bindingProperties: this.tableBindingProperties,
                });

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        c.recordActions.addItem
                    ]
                });

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) )

                c.sub.add( c.onAddItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new MedioTransferencia ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.create }) )
                ) );

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openObjectComponent( c.store, c.store.storeFromThisAsync( e.item, this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, state: StateObjectComponent.read }) )
                ) );

            } )
        )
    }


    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<MedioTransferencia> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Medios de Transferencia',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<MedioTransferencia[]>, store: ComponentStore<MedioTransferencia> )
    {
        return this.modalService.open( ObjectComponent<MedioTransferencia> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Medio de Transferencia',
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
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
