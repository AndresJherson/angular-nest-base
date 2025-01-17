import { EventEmitter, inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { map, tap } from 'rxjs';
import { Cliente, DocumentoTransaccion, NotaVenta, Prop, PropBehavior } from '@app/models';
import { OverlayService } from '../../services/overlay.service';
import { ModalService } from '../../services/modal.service';
import { StateRowTableComponent, TableComponent, TableComponentVm } from '../../views/CollectionComponents/Table/Table.component';
import { NotaVentaService } from './NotaVenta/nota-venta.service';
import { StateComponentNotaVentaComponent } from '../../views/ObjectComponents/DocumentosTransaccion/NotaVenta/NotaVenta.component';

@Injectable({
  providedIn: 'root'
})
export class DocumentoTransaccionService {

    httpService = inject( HttpService );
    serviceName = 'documentoTransaccion';
    modalService = inject( ModalService );
    notaVentaService = inject( NotaVentaService );


    getCollection()
    {
        return this.httpService.post<DocumentoTransaccion[]>({
            service: this.serviceName,
            method: 'getCollection'
        })
        .pipe( map( data => DocumentoTransaccion.initialize( data ) ) )
    }


    getCollectionIssued()
    {
        return this.httpService.post<DocumentoTransaccion[]>({
            service: this.serviceName,
            method: 'getCollectionIssued'
        })
        .pipe( map( data => DocumentoTransaccion.initialize( data ) ) )
    }


    getCollectionPorCliente( cliente: Cliente )
    {
        return this.httpService.post<DocumentoTransaccion[]>({
            service: this.serviceName,
            method: 'getCollectionPorCliente',
            values: { cliente }
        })
        .pipe( map( data => DocumentoTransaccion.initialize( data ) ) )
    }


    tableComponentBindingProperties: TableComponentVm<DocumentoTransaccion>['bindingProperties'] = [
        { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
        { title: 'Codigo Serie', getValue: item => item.codigoSerie, behavior: PropBehavior.string },
        { title: 'Codigo Numero', getValue: item => item.codigoNumero, behavior: PropBehavior.number },
        { title: 'Impote Neto', getValue: item => Prop.toDecimal( item.importeNeto ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: 'Importe Cobrado', getValue: item => Prop.toDecimal( item.importeCobrado ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: '% Cobrado', getValue: item => `${Prop.toDecimal( item.porcentajeCobrado ).toFixed( 2 )} %`, behavior: PropBehavior.number },
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
    ]


    openTableComponent( overlayService: OverlayService )
    {
        return overlayService.open( TableComponent<DocumentoTransaccion> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollection() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Documentos de Transacción',
                    stateRow: StateRowTableComponent.select,
                    bindingProperties: this.tableComponentBindingProperties
                });


                const onAddNotaVenta = new EventEmitter();

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Nuevo Nota de Venta',
                            onClick: e => onAddNotaVenta.emit()
                        }
                    ]
                });

                c.sub.add( c.onClose.subscribe( () => overlayService.close( c ) ) );

                c.sub.add( onAddNotaVenta.subscribe( () => {
                    this.notaVentaService.openNotaVentaComponent( c.store, c.store.storeFromThis( () => new NotaVenta() ), overlayService )
                    .subscribe( nvc => nvc.vm$.next({ ...nvc.vm$.value, stateComponent: StateComponentNotaVentaComponent.create }) )
                } ) )

            } )
        )
    }


    openTableComponent2selectIssued( )
    {
        return this.modalService.open( TableComponent<DocumentoTransaccion> ).pipe(
            tap( c => {

                c.store.setRead( this.getCollectionIssued() )
                        .getRead()
                        .subscribe();

                c.vm$.next({
                    ...c.vm$.value,
                    title: 'Documentos de Transacción',
                    stateRow: StateRowTableComponent.radioButton,
                    bindingProperties: this.tableComponentBindingProperties
                });


            } )
        )
    }
}
