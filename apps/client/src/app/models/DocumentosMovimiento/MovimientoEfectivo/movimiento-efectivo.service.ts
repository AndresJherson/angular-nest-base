import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ModalService } from '../../../services/modal.service';
import { map, tap } from 'rxjs';
import { EntradaEfectivo, MovimientoEfectivo, PropBehavior, SalidaEfectivo } from '@app/models';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { OverlayService } from '../../../services/overlay.service';
import { ObjectComponent, StateObjectComponent } from '../../../views/ObjectComponents/Object/Object.component';
import { ComponentStore } from '../../../services/ComponentStore';
import { MovimientoEfectivoComponent, StateComponentMovimientoEfectivoComponent } from '../../../views/ObjectComponents/DocumentosMovimiento/MovimientoEfectivo/MovimientoEfectivo.component';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class MovimientoEfectivoService {

    serviceName = 'movimientoEfectivo';    
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<MovimientoEfectivo[]>({
            service: this.serviceName,
            method: 'getCollection'
        })
        .pipe( map( data => MovimientoEfectivo.initialize( data ) ) )
    }


    getItem( movimientoEfectivo: MovimientoEfectivo )
    {
        return this.httpService.post<MovimientoEfectivo>({
            service: this.serviceName,
            method: 'getItem',
            values: { movimientoEfectivo }
        })
        .pipe( map( item => MovimientoEfectivo.initialize([ new MovimientoEfectivo( item ) ])[0] ) )
    }


    createItem( movimientoEfectivo: MovimientoEfectivo )
    {
        return this.httpService.post<MovimientoEfectivo>({
            service: this.serviceName,
            method: 'createItem',
            values: { movimientoEfectivo }
        })
        .pipe( map( item => MovimientoEfectivo.initialize([ new MovimientoEfectivo( item ) ])[0] ) )
    }


    updateItemCancel( movimientoEfectivo: MovimientoEfectivo )
    {
        return this.httpService.post<MovimientoEfectivo>({
            service: this.serviceName,
            method: 'updateItemCancel',
            values: { movimientoEfectivo }
        })
        .pipe( map( item => MovimientoEfectivo.initialize([ new MovimientoEfectivo( item ) ])[0] ) )
    }

    // PRUEBA
    deleteItem( movimientoEfectivo: MovimientoEfectivo )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { movimientoEfectivo }
        })
    }


    tableBindingProperties: TableComponentVm<MovimientoEfectivo>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        {
            title: 'Movimiento',
            getValue: item =>
                item instanceof EntradaEfectivo
                    ? 'Entrada'
                : item instanceof SalidaEfectivo
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
        return overlayService.open( TableComponent<MovimientoEfectivo> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Movimientos de Efectivo',
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
                    this.openMovimientoEfectivoComponent( c.store, c.store.storeFromThis( () => new EntradaEfectivo() ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoEfectivoComponent.createServer }) )
                ) )

                c.sub.add( onAddSalida.subscribe( () => 
                    this.openMovimientoEfectivoComponent( c.store, c.store.storeFromThis( () => new SalidaEfectivo() ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoEfectivoComponent.createServer }) )
                ) )

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openMovimientoEfectivoComponent( c.store, c.store.storeFromThisAsync( e.item, this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoEfectivoComponent.readServer }) )
                ) );

            } )
        );
    }
    

    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<MovimientoEfectivo> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Movimientos de Efectivo',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableBindingProperties
                });

            } )
        )
    }


    openMovimientoEfectivoComponent( parentStore: ComponentStore<MovimientoEfectivo[]>, store: ComponentStore<MovimientoEfectivo> )
    {
        return this.modalService.open( MovimientoEfectivoComponent )
        .pipe(
            tap( c => {

                c.storeMovimientoEfectivo = store;

                c.vm$.next({
                    ...c.vm$.value,
                    title: store.getState() instanceof EntradaEfectivo
                                ? 'Entrada de Efectivo'
                            :store.getState() instanceof SalidaEfectivo
                                ? 'Salida de Efectivo'
                                : 'Movimiento de Efectivo',
                    isAttached: true
                })
                
                c.sub.add( c.onIssue.subscribe( e => {

                    this.createItem( MovimientoEfectivo.initialize([ e.movimientoEfectivo ])[0].emitir() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoEfectivoComponent.readServer });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onCancel.subscribe( e => {

                    this.updateItemCancel( MovimientoEfectivo.initialize([ e.movimientoEfectivo ])[0].anular() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoEfectivoComponent.readServer });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onDelete.subscribe( e => {

                    this.deleteItem( e.movimientoEfectivo ).subscribe({
                        next: item => {

                            c.sub.add( c.storeMovimientoEfectivo.state$.subscribe({
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
