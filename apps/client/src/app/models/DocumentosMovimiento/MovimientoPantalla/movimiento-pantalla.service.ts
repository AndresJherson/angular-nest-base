import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ModalService } from '../../../services/modal.service';
import { EntradaPantalla, MovimientoPantalla, PropBehavior, SalidaPantalla } from '@app/models';
import { map, tap } from 'rxjs';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../../views/CollectionComponents/Table/Table.component';
import { OverlayService } from '../../../services/overlay.service';
import { ComponentStore } from '../../../services/ComponentStore';
import { MovimientoPantallaComponent, StateComponentMovimientoPantallaComponent } from '../../../views/ObjectComponents/DocumentosMovimiento/MovimientoPantalla/MovimientoPantalla.component';
import { MessageBoxComponent } from '../../../views/Components/MessageBox/MessageBox.component';

@Injectable({
  providedIn: 'root'
})
export class MovimientoPantallaService {

    serviceName = 'movimientoPantalla';
    httpService = inject( HttpService );
    modalService = inject( ModalService );


    getCollection()
    {
        return this.httpService.post<MovimientoPantalla[]>({
            service: this.serviceName,
            method: 'getCollection'
        })
        .pipe( map( data => MovimientoPantalla.initialize( data ) ) )
    }


    getItem( movimientoPantalla: MovimientoPantalla )
    {
        return this.httpService.post<MovimientoPantalla>({
            service: this.serviceName,
            method: 'getItem',
            values: { movimientoPantalla }
        })
        .pipe( map( item => MovimientoPantalla.initialize([ new MovimientoPantalla( item ) ])[0] ) )
    }


    createItem( movimientoPantalla: MovimientoPantalla )
    {
        return this.httpService.post<MovimientoPantalla>({
            service: this.serviceName,
            method: 'createItem',
            values: { movimientoPantalla }
        })
        .pipe( map( item => MovimientoPantalla.initialize([ new MovimientoPantalla( item ) ])[0] ) )
    }


    updateItemCancel( movimientoPantalla: MovimientoPantalla )
    {
        return this.httpService.post<MovimientoPantalla>({
            service: this.serviceName,
            method: 'updateItemCancel',
            values: { movimientoPantalla }
        })
        .pipe( map( item => MovimientoPantalla.initialize([ new MovimientoPantalla( item ) ])[0] ) )
    }

    // PRUEBA
    deleteItem( movimientoPantalla: MovimientoPantalla )
    {
        return this.httpService.post({
            service: this.serviceName,
            method: 'deleteItem',
            values: { movimientoPantalla }
        })
    }


    tableBindingProperties: TableComponentVm<MovimientoPantalla>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        {
            title: 'Movimiento',
            getValue: item =>
                item instanceof EntradaPantalla
                    ? 'Entrada'
                : item instanceof SalidaPantalla
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
        return overlayService.open( TableComponent<MovimientoPantalla> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Movimientos de Pantalla',
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
                    this.openMovimientoPantallaComponent( c.store, c.store.storeFromThis( () => new EntradaPantalla() ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoPantallaComponent.createServer }) )
                ) )

                c.sub.add( onAddSalida.subscribe( () => 
                    this.openMovimientoPantallaComponent( c.store, c.store.storeFromThis( () => new SalidaPantalla() ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoPantallaComponent.createServer }) )
                ) )

                c.sub.add( c.onSelectItem.subscribe( e => 
                    this.openMovimientoPantallaComponent( c.store, c.store.storeFromThisAsync( e.item, this.getItem( e.item ) ) )
                    .subscribe( oc => oc.vm$.next({ ...oc.vm$.value, stateComponent: StateComponentMovimientoPantallaComponent.readServer }) )
                ) );

            } )
        );
    }
    

    openTableComponent2selectItem()
    {
        return this.modalService.open( TableComponent<MovimientoPantalla> ).pipe(
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


    openMovimientoPantallaComponent( parentStore: ComponentStore<MovimientoPantalla[]>, store: ComponentStore<MovimientoPantalla> )
    {
        return this.modalService.open( MovimientoPantallaComponent )
        .pipe(
            tap( c => {

                c.storeMovimientoPantalla = store;

                c.vm$.next({
                    ...c.vm$.value,
                    title: store.getState() instanceof EntradaPantalla
                                ? 'Entrada de Pantalla'
                            :store.getState() instanceof SalidaPantalla
                                ? 'Salida de Pantalla'
                                : 'Movimiento de Pantalla',
                    isAttached: true
                })
                
                c.sub.add( c.onIssue.subscribe( e => {

                    this.createItem( MovimientoPantalla.initialize([ e.movimientoPantalla ])[0].emitir() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoPantallaComponent.readServer });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onCancel.subscribe( e => {

                    this.updateItemCancel( MovimientoPantalla.initialize([ e.movimientoPantalla ])[0].anular() ).subscribe({
                        next: item => {

                            store.setRead( this.getItem( item ) )
                            c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoPantallaComponent.readServer });

                            parentStore.getRead().subscribe();

                        },
                        error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                    });

                } ) );

                c.sub.add( c.onDelete.subscribe( e => {

                    this.deleteItem( e.movimientoPantalla ).subscribe({
                        next: item => {

                            c.sub.add( c.storeMovimientoPantalla.state$.subscribe({
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
