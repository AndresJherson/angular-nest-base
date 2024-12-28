import { inject, Injectable } from '@angular/core';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { HttpService } from 'apps/client/src/app/services/http.service';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { OverlayService } from 'apps/client/src/app/services/overlay.service';
import { StateRowTableComponent, TableComponent, TableComponentVm } from 'apps/client/src/app/views/CollectionComponents/Table/Table.component';
import { MessageBoxComponent } from 'apps/client/src/app/views/Components/MessageBox/MessageBox.component';
import { ObjectComponent, StateObjectComponent } from 'apps/client/src/app/views/ObjectComponents/Object/Object.component';
import { Calidad } from 'apps/models/src/lib/ElementosEconomicos/Bien/Pantalla/Calidad';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalidadService {

    serviceName = 'calidad';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<Calidad[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new Calidad( item ) ) ) )
    }


    getItem( calidad: Calidad )
    {
        return this.httpService.post<Calidad>({
            service: this.serviceName,
            method: 'getItem',
            values: { calidad }
        })
        .pipe( map( item => new Calidad( item ) ) )
    }


    createItem( calidad: Calidad )
    {
        return this.httpService.post<Calidad>({
            service: this.serviceName,
            method: 'createItem',
            values: { calidad }
        })
        .pipe( map( item => new Calidad( item ) ) )
    }


    updateItem( calidad: Calidad )
    {
        return this.httpService.post<Calidad>({
            service: this.serviceName,
            method: 'updateItem',
            values: { calidad }
        })
        .pipe( map( item => new Calidad( item ) ) )
    }


    deleteItem( calidad: Calidad )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { calidad }
        })
    }


    tableBindingProperties: TableComponentVm<Calidad>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<Calidad> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Calidades de Pantalla',
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
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new Calidad() ) )
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
        return this.modalService.open( TableComponent<Calidad> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Calidades de Pantalla',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<Calidad[]>, store: ComponentStore<Calidad> )
    {
        return this.modalService.open( ObjectComponent<Calidad> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    title: 'Calidad de Pantalla',
                    isCloseActive: true,
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
