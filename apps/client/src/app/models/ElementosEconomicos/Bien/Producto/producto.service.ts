import { inject, Injectable } from '@angular/core';
import { HttpService } from 'apps/client/src/app/services/http.service';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { BienCategoriaService } from '../bien-categoria.service';
import { BienMarcaService } from '../bien-marca.service';
import { map, tap } from 'rxjs';
import { Producto } from 'apps/models/src/lib/ElementosEconomicos/Bien/Producto/Producto';
import { StateRowTableComponent, TableComponent, TableComponentVm } from 'apps/client/src/app/views/CollectionComponents/Table/Table.component';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { OverlayService } from 'apps/client/src/app/services/overlay.service';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { ObjectComponent, StateObjectComponent } from 'apps/client/src/app/views/ObjectComponents/Object/Object.component';
import { MagnitudService } from '../magnitud.service';
import { MessageBoxComponent } from 'apps/client/src/app/views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

    serviceName = 'producto';
    httpService = inject( HttpService );
    modalService = inject( ModalService );
    magnitudService = inject( MagnitudService );
    bienCategoriaService = inject( BienCategoriaService );
    bienMarcaService = inject( BienMarcaService );


    getCollection()
    {
        return this.httpService.post<Producto[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new Producto( item ) ) ) )
    }


    getItem( producto: Producto )
    {
        return this.httpService.post<Producto>({
            service: this.serviceName,
            method: 'getItem',
            values: { producto }
        })
        .pipe( map( item => new Producto( item ) ) )
    }


    createItem( producto: Producto )
    {
        return this.httpService.post<Producto>({
            service: this.serviceName,
            method: 'createItem',
            values: { producto }
        })
        .pipe( map( item => new Producto( item ) ) )
    }


    updateItem( producto: Producto )
    {
        return this.httpService.post<Producto>({
            service: this.serviceName,
            method: 'updateItem',
            values: { producto }
        })
        .pipe( map( item => new Producto( item ) ) )
    }


    deleteItem( producto: Producto )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { producto }
        })
    }


    tableBindingProperties: TableComponentVm<Producto>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
        { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
        { title: 'Magnitud', getValue: item => item.magnitud?.nombre, behavior: PropBehavior.string },
        { title: 'Marca', getValue: item => item.bienMarca?.nombre, behavior: PropBehavior.string },
        { title: 'Categoria', getValue: item => item.bienCategoria?.nombre, behavior: PropBehavior.string },
        { title: 'Precio Uni.', getValue: item => item.precioUnitario, behavior: PropBehavior.number },
        { title: 'Salida', getValue: item => item.esSalida ? 'Sí' : 'No', behavior: PropBehavior.boolean },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<Producto> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Productos',
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
                    this.openObjectComponent( c.store, c.store.storeFromThis( () => new Producto() ) )
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
        return this.modalService.open( TableComponent<Producto> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Productos',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openObjectComponent( parentStore: ComponentStore<Producto[]>, store: ComponentStore<Producto> )
    {
        return this.modalService.open( ObjectComponent<Producto> )
        .pipe(
            tap( c => {

                c.store = store;

                c.vm$.next({
                    title: 'Producto',
                    isCloseActive: true,
                    state: StateObjectComponent.read,
                    bindingProperties: [
                        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                        { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
                        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
                        { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                        { title: 'Magnitud', getValue: item => item.magnitud?.nombre, setValue: ( item, value ) => item.set({ magnitud: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.magnitudService.openTableComponent2selectItem().subscribe( tc => {
                                
                                tc.sub.add( tc.store.state$.subscribe( () => 
                                    item.magnitud
                                    ? tc.setDataChecked([ item.magnitud ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( magnitud => new Producto({
                                        ...magnitud,
                                        magnitud: e.item
                                    }) )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( magnitud => new Producto({
                                        ...magnitud,
                                        magnitud: e.item
                                    }) )
                                }) );

                            } );
                        } },
                        { title: 'Marca', getValue: item => item.bienMarca?.nombre, setValue: ( item, value ) => item.set({ bienMarca: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.bienMarcaService.openTableComponent2selectItem().subscribe( tc => {
                                
                                tc.sub.add( tc.store.state$.subscribe( () => 
                                    item.bienMarca
                                    ? tc.setDataChecked([ item.bienMarca ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( magnitud => new Producto({
                                        ...magnitud,
                                        bienMarca: e.item
                                    }) )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( magnitud => new Producto({
                                        ...magnitud,
                                        bienMarca: e.item
                                    }) )
                                }) );                                

                            } );
                        } },
                        { title: 'Categoria', getValue: item => item.bienCategoria?.nombre, setValue: ( item, value ) => item.set({ bienCategoria: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                            this.bienCategoriaService.openTableComponent2selectItem().subscribe( tc => {
                                
                                tc.sub.add( tc.store.state$.subscribe( () => 
                                    item.bienCategoria
                                    ? tc.setDataChecked([ item.bienCategoria ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( magnitud => new Producto({
                                        ...magnitud,
                                        bienCategoria: e.item
                                    }) )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( magnitud => new Producto({
                                        ...magnitud,
                                        bienCategoria: e.item
                                    }) )
                                }) );                                

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
