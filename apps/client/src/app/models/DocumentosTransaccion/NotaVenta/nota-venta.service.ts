import { inject, Injectable } from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { NotaVentaComponent, StateComponentNotaVentaComponent, StateDocumentNotaVentaComponent } from '../../../views/ObjectComponents/DocumentosTransaccion/NotaVenta/NotaVenta.component';
import { HttpService } from '../../../services/http.service';
import { ModalService } from '../../../services/modal.service';
import { DocumentoTransaccion, NotaVenta, Prop, PropBehavior } from '@app/models';
import { map, tap } from 'rxjs';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { ComponentStore } from '../../../services/ComponentStore';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class NotaVentaService {


    serviceName = 'notaVenta';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<NotaVenta[]>({
            service: this.serviceName,
            method: 'getCollection',
        })
        .pipe( map( data => data.map( item => new NotaVenta( item ) ) ) )
    }


    getItem( notaVenta: NotaVenta )
    {
        return this.httpService.post<NotaVenta>({
            service: this.serviceName,
            method: 'getItem',
            values: { notaVenta }
        })
        .pipe( map( item => new NotaVenta( item ) ) )
    }


    createItem( notaVenta: NotaVenta )
    {
        return this.httpService.post<NotaVenta>({
            service: this.serviceName,
            method: 'createItem',
            values: { notaVenta }
        })
        .pipe( map( item => new NotaVenta( item ) ) )
    }


    updateItem( notaVenta: NotaVenta )
    {
        return this.httpService.post<NotaVenta>({
            service: this.serviceName,
            method: 'updateItem',
            values: { notaVenta }
        })
        .pipe( map( item => new NotaVenta( item ) ) )
    }


    updateItemCancel( notaVenta: NotaVenta )
    {
        return this.httpService.post<NotaVenta>({
            service: this.serviceName,
            method: 'updateItemCancel',
            values: { notaVenta }
        })
        .pipe( map( item => new NotaVenta( item ) ) )
    }


    deleteItem( notaVenta: NotaVenta )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { notaVenta }
        })
    }


    tableBindingProperties: TableComponentVm<NotaVenta>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Serie', getValue: item => item.codigoSerie, behavior: PropBehavior.string },
        { title: 'Número', getValue: item => item.codigoNumero, behavior: PropBehavior.number },
        { title: 'Importe Neto', getValue: item => Prop.toDecimal( item.importeNeto ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: 'Importe Cobrado', getValue: item => Prop.toDecimal( item.importeCobrado ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: '% Cobrado', getValue: item => `${Prop.toDecimal( item.porcentajeCobrado ).toFixed( 2 )} %`, behavior: PropBehavior.number },
        { title: 'Usuario Emisor', getValue: item => item.usuario?.nombre, behavior: PropBehavior.number },
        { title: 'Cliente Receptor', getValue: item => item.cliente?.nombre ?? item.receptorNombre, behavior: PropBehavior.number },
        { 
            title: 'Estado', 
            getValue: item => 
                item.fechaAnulacion
                    ? 'Anulado'
                : item.fechaEmision
                    ? 'Emitido'
                : item.fechaCreacion
                    ? 'Borrador'
                    : 'Borrador',
            behavior: PropBehavior.string 
        },
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<NotaVenta> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Notas de Venta',
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
                    this.openNotaVentaComponent( c.store as unknown as ComponentStore<DocumentoTransaccion[]>, c.store.storeFromThisAsync( new NotaVenta(), this.getItem( e.item ) ), overlayService )
                    .subscribe( c => c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentNotaVentaComponent.read }) );
                } ) );

                c.sub.add( c.onAddItem.subscribe( e => {
                    this.openNotaVentaComponent( c.store as unknown as ComponentStore<DocumentoTransaccion[]>, c.store.storeFromThis( () => new NotaVenta() ), overlayService )
                    .subscribe( c => c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentNotaVentaComponent.create }) );
                } ) );

            } )
        );
    }


    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<NotaVenta> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe()


                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Notas de Venta',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                })                

            } )
        )
    }    


    openNotaVentaComponent( parentStore: ComponentStore<DocumentoTransaccion[]>, store: ComponentStore<NotaVenta>, overlayService: OverlayService )
    {
        return overlayService.open( NotaVentaComponent ).pipe(
            tap( c => {

                c.storeNotaVenta = store;

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

                c.sub.add( c.onCreate.subscribe( e => {

                    this.createItem( new NotaVenta( e.notaVenta ).crearBorrador() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentNotaVentaComponent.read });
                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onUpdate.subscribe( e => {

                    this.updateItem( new NotaVenta( e.notaVenta ).actualizarBorrador() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentNotaVentaComponent.read });
                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onDelete.subscribe( e => {

                    this.deleteItem( e.notaVenta ).subscribe({
                        next: item => {

                            c.sub.add( c.storeNotaVenta.state$.subscribe({
                                complete: () => parentStore.getRead().subscribe()
                            }) )
                            c.close( e.event );

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onIssue.subscribe( e => {

                    if ( e.sender.vm$.value.stateComponent === StateComponentNotaVentaComponent.create ) {

                        this.createItem( new NotaVenta( e.notaVenta ).emitir() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentNotaVentaComponent.read });
                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )

                    });

                    }
                    else {

                        this.updateItem( new NotaVenta( e.notaVenta ).emitir() ).subscribe({
                            next: item => {
    
                                store.setRead( this.getItem( item ) )
                                c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentNotaVentaComponent.read });
                                parentStore.getRead().subscribe();
    
                            },
                            error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                        });

                    }


                } ) );

                c.sub.add( c.onCancel.subscribe( e => {

                    this.updateItemCancel( new NotaVenta( e.notaVenta ).anular() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

            } )
        );
    }
}
