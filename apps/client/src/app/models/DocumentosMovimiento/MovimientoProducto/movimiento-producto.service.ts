import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ModalService } from '../../../services/modal.service';
import { map, tap } from 'rxjs';
import { EntradaProducto, MovimientoProducto, PropBehavior, SalidaProducto } from '@app/models';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { OverlayService } from '../../../services/overlay.service';
import { ComponentStore } from '../../../services/ComponentStore';
import { MovimientoProductoComponent, StateComponentMovimientoProductoComponent } from '../../../views/ObjectComponents/DocumentosMovimiento/MovimientoProducto/MovimientoProducto.component';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class MovimientoProductoService {

    serviceName = 'movimientoProducto';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<MovimientoProducto[]>({
            service: this.serviceName,
            method: 'getCollection'
        })
        .pipe( map( data => MovimientoProducto.initialize( data ) ) )
    }


    getItem( movimientoProducto: MovimientoProducto )
    {
        return this.httpService.post<MovimientoProducto>({
            service: this.serviceName,
            method: 'getItem',
            values: { movimientoProducto }
        })
        .pipe( map( item => MovimientoProducto.initialize([ new MovimientoProducto( item ) ])[0] ) )
    }


    createItem( movimientoProducto: MovimientoProducto )
    {
        return this.httpService.post<MovimientoProducto>({
            service: this.serviceName,
            method: 'createItem',
            values: { movimientoProducto }
        })
        .pipe( map( item => MovimientoProducto.initialize([ new MovimientoProducto( item ) ])[0] ) )
    }


    updateItemCancel( movimientoProducto: MovimientoProducto )
    {
        return this.httpService.post<MovimientoProducto>({
            service: this.serviceName,
            method: 'updateItemCancel',
            values: { movimientoProducto }
        })
        .pipe( map( item => MovimientoProducto.initialize([ new MovimientoProducto( item ) ])[0] ) )
    }

    // PRUEBA
    deleteItem( movimientoProducto: MovimientoProducto )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { movimientoProducto }
        })
    }


    tableBindingProperties: TableComponentVm<MovimientoProducto>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        {
            title: 'Movimiento',
            getValue: item =>
                item instanceof EntradaProducto
                    ? 'Entrada'
                : item instanceof SalidaProducto
                    ? 'Salida'
                    : '',
            behavior: PropBehavior.string
        },
        { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
        { 
            title: 'Doc. Transacción Asociado', 
            getValue: item =>
                item.documentoTransaccion?.codigoSerie && item.documentoTransaccion.codigoNumero
                    ? `${item.documentoTransaccion.codigoSerie}-${item.documentoTransaccion.codigoNumero}`
                    : '', 
            behavior: PropBehavior.string 
        },
        { title: 'Importe Neto', getValue: item => item.importeNeto, behavior: PropBehavior.number },
        { title: 'Usuario Emisor', getValue: item => item.usuario?.nombre, behavior: PropBehavior.number },
        {
            title: 'Estado',
            getValue: item =>
                item.fechaAnulacion
                    ? 'Anulado'
                : item.fechaEmision
                    ? 'Emitido'
                    : '',
            behavior: PropBehavior.string
        }
    ];


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<MovimientoProducto> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Movimientos de Producto',
                    stateRow: StateRowTableComponent.select,
                    bindingProperties: this.tableBindingProperties
                });

                const onAddEntrada = new EventEmitter();
                const onAddSalida = new EventEmitter();

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Entrada',
                            onClick: e => onAddEntrada.emit()
                        },
                        {
                            title: 'Salida',
                            onClick: e => onAddSalida.emit()
                        }
                    ]
                });

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

                c.sub.add( onAddEntrada.subscribe( () => 
                    this.openMovimientoPantallaComponent( c.store, c.store.storeFromThis( () => new EntradaProducto() ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoProductoComponent.createServer }) )
                ) )

                c.sub.add( onAddSalida.subscribe( () => 
                    this.openMovimientoPantallaComponent( c.store, c.store.storeFromThis( () => new SalidaProducto() ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoProductoComponent.createServer }) )
                ) )

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openMovimientoPantallaComponent( c.store, c.store.storeFromThisAsync( e.item, this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoProductoComponent.readServer }) )
                ) );

            } )
        );
    }
    

    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<MovimientoProducto> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Movimientos de Pantalla',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openMovimientoPantallaComponent( parentStore: ComponentStore<MovimientoProducto[]>, store: ComponentStore<MovimientoProducto> )
    {
        return this.modalService.open( MovimientoProductoComponent )
        .pipe(
            tap( c => {

                c.storeMovimientoProducto = store;

                c.vm$.next({
                    ...c.vm$.value,
                    title: store.getState() instanceof EntradaProducto
                                ? 'Entrada de Producto'
                            :store.getState() instanceof SalidaProducto
                                ? 'Salida de Producto'
                                : 'Movimiento de Producto',
                    isAttached: true
                })
                
                c.sub.add( c.onIssue.subscribe( e => {

                    this.createItem( MovimientoProducto.initialize([ e.movimientoProducto ])[0].emitir() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoProductoComponent.readServer });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onCancel.subscribe( e => {

                    this.updateItemCancel( MovimientoProducto.initialize([ e.movimientoProducto ])[0].anular() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoProductoComponent.readServer });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onDelete.subscribe( e => {

                    this.deleteItem( e.movimientoProducto ).subscribe({
                        next: item => {

                            c.sub.add( c.storeMovimientoProducto.state$.subscribe({
                                complete: () => parentStore.getRead().subscribe()
                            }) );
                            c.close( e.event )

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    })

                } ) )

            } )
        );
    }
}