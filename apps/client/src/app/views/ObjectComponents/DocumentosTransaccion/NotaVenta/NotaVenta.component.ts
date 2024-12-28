import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { NotaVenta } from '../../../../../../../models/src/lib/DocumentosTransaccion/NotaVenta/NotaVenta';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ButtonsMenuComponent, ButtonsMenuComponentVm } from '../../../Components/ButtonsMenu/ButtonsMenu.component';
import { ButtonsFooterComponent, ButtonsFooterComponentVm } from '../../../Components/ButtonsFooter/ButtonsFooter.component';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { ModalService } from '../../../../services/modal.service';
import { StateRowTableComponent, TableComponentVm, TableComponent } from '../../../CollectionComponents/Table/Table.component';
import { TabComponent, TabItemComponent } from "../../../Components/Tab/Tab.component";
import { FormsModule } from '@angular/forms';
import { NotaVentaDetalle } from 'apps/models/src/lib/DocumentosTransaccion/NotaVenta/NotaVentaDetalle';
import { Prop, PropBehavior } from 'apps/models/src/lib/Model';
import { ClienteService } from 'apps/client/src/app/models/Personas/Cliente/cliente.service';
import { ElementoEconomicoService } from 'apps/client/src/app/models/ElementosEconomicos/elemento-economico.service';
import { ElementoEconomico } from 'apps/models/src/lib/ElementosEconomicos/ElementoEconomico';
import { ObjectComponent, StateObjectComponent } from '../../Object/Object.component';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { NotaVentaCuota } from 'apps/models/src/lib/DocumentosTransaccion/NotaVenta/NotaVentaCuota';
import { BUTTON_CLASS_BOOTSTRAP } from 'apps/client/src/app/utils/ButtonsClass';
import { ItemType } from 'apps/client/src/app/interfaces/ItemType';
import { Nota } from 'apps/models/src/lib/DocumentosTransaccion/Nota';
import { CollectionNotaComponent } from "../../../CollectionComponents/CollectionNota/CollectionNota.component";
import { DocumentoIdentificacionService } from 'apps/client/src/app/models/Personas/documento-identificacion.service';

@Component({
  selector: 'app-nota-venta',
  imports: [
    CommonModule,
    ButtonsMenuComponent,
    TabComponent,
    TabItemComponent,
    ButtonsFooterComponent,
    FormsModule,
    TableComponent,
    CollectionNotaComponent
],
  templateUrl: './NotaVenta.component.html',
  styleUrl: './NotaVenta.component.css',
})
export class NotaVentaComponent implements IComponent<NotaVentaComponent> {

    static id = 0;
    instanceId = 0;
    @Input() storeNotaVenta = new ComponentStore<NotaVenta>( new NotaVenta(), () =>
        new NotaVenta()
        .setLiquidacionTipo( 2 )
        .agregarDetalle(new NotaVentaDetalle({
            cantidad: 1,
            importeUnitario: 4521.025
        }))
        .agregarDetalle(new NotaVentaDetalle({
            cantidad: 1,
            importeUnitario: 4521.025
        }))
        .agregarNota(new Nota({
            fechaCreacion: Prop.toDateTimeNow().minus({ month: 3 }).toSQL(),
            descripcion: 'Primera nota'
        }))
        .agregarNota(new Nota({
            fechaCreacion: Prop.toDateTimeNow().minus({ hour: 9 }).toSQL(),
            descripcion: 'Segunda nota'
        }))
        .agregarNota(new Nota({
            fechaCreacion: '-',
            descripcion: 'Tercera nota'
        }))
        .agregarNota(new Nota({
            fechaCreacion: Prop.toDateTimeNow().minus({ day: 1 }).toSQL(),
            descripcion: 'Primera nota'
        }))
        .agregarNota(new Nota({
            fechaCreacion: Prop.toDateTimeNow().minus({ hour: 9 }).toSQL(),
            descripcion: 'Segunda nota'
        }))
        .agregarNota(new Nota({
            fechaCreacion: '-',
            descripcion: 'Tercera nota'
        }))
        .borrador()
    );

    notaVenta: NotaVenta = new NotaVenta();
    codigoElementoEconomico2search = '';


    buttonsMenuComponentVm$ = new BehaviorSubject<ButtonsMenuComponentVm>({
        buttons: []
    });

    buttonsFooterComponentVm$ = new BehaviorSubject<ButtonsFooterComponentVm>({
        buttonsHtml: []
    });

    storeDetalles = this.storeNotaVenta.storeFromThis( notaVenta => notaVenta.detalles.map( item => new NotaVentaDetalle( item ) ) );
    detallesTableComponentVm$ = new BehaviorSubject<TableComponentVm<NotaVentaDetalle>>({
        title: '',
        isHeadActive: false,
        isCloseButtonActive: false,
        stateRow: StateRowTableComponent.select,
        bindingProperties: [
            { title: 'Código', getValue: detalle => detalle.elementoEconomico?.codigo, behavior: PropBehavior.string },
            { title: 'Concepto', getValue: detalle => detalle.concepto, behavior: PropBehavior.string },
            { title: 'Cantidad', getValue: detalle => Prop.toDecimal( detalle.cantidad ).toFixed( 2 ), behavior: PropBehavior.number },
            { title: 'Precio Uni.', getValue: detalle => Prop.toDecimal( detalle.importeUnitario ).toFixed( 2 ), behavior: PropBehavior.number },
            { title: 'Descuento', getValue: detalle => Prop.toDecimal( detalle.importeDescuento ).toFixed( 2 ), behavior: PropBehavior.number },
            { title: 'Importe', getValue: detalle => Prop.toDecimal( detalle.importeNeto ).toFixed( 2 ), behavior: PropBehavior.number },
        ]
    })

    storeImportes = this.storeNotaVenta.storeFromThis<NotaVentaComponentImporte[]>( notaVenta => [
        {
            symbol: Symbol(),
            title: 'Importe Bruto',
            amount: notaVenta.importeBruto
        },
        {
            symbol: Symbol(),
            title: 'Descuento',
            amount: notaVenta.importeDescuento
        },
        {
            symbol: Symbol(),
            title: 'Anticipo',
            amount: notaVenta.importeAnticipo
        },
        {
            symbol: Symbol(),
            title: 'Importe Neto',
            amount: notaVenta.importeNeto
        }
    ] );
    importesTableComponentVm$ = new BehaviorSubject<TableComponentVm<NotaVentaComponentImporte>>({
        title: '',
        isHeadActive: false,
        isCloseButtonActive: false,
        stateRow: StateRowTableComponent.select,
        bindingProperties: [
            { title: 'Titulo', getValue: item => item.title, behavior: PropBehavior.string },
            { title: 'Importe', getValue: item => Prop.toDecimal( item.amount ).toFixed( 2 ), behavior: PropBehavior.number }
        ]
    });

    storeCuotas = this.storeNotaVenta.storeFromThis( notaVenta => notaVenta.credito.cuotas.map( item => new NotaVentaCuota( item ) ) );
    cuotasTableComponentVm$ = new BehaviorSubject<TableComponentVm<NotaVentaCuota>>({
        title: '',
        isHeadActive: false,
        isCloseButtonActive: false,
        stateRow: StateRowTableComponent.select,
        bindingProperties: [
            { title: 'Periodo', getValue: item => item.numero, behavior: PropBehavior.number },
            { title: 'Fecha Inicio', getValue: item => Prop.toDateTime( item.fechaInicio ).toFormat( 'dd/MM/yyyy' ), behavior: PropBehavior.date },
            { title: 'Fecha Vencimiento', getValue: item => Prop.toDateTime( item.fechaVencimiento ).toFormat( 'dd/MM/yyyy' ), behavior: PropBehavior.date },
            { title: 'Cuota', getValue: item => Prop.toDecimal( item.importeCuota ).toFixed( 2 ), behavior: PropBehavior.number },
            { title: 'Interés', getValue: item => Prop.toDecimal( item.importeInteres ).toFixed( 2 ), behavior: PropBehavior.number },
            { title: 'Amortización', getValue: item => Prop.toDecimal( item.importeAmortizacion ).toFixed( 2 ), behavior: PropBehavior.number },
            { title: 'Saldo', getValue: item => Prop.toDecimal( item.importeSaldo ).toFixed( 2 ), behavior: PropBehavior.number },
        ]
    });

    storeNotas = this.storeNotaVenta.storeFromThis( notaVenta => notaVenta.notas )


    buttonsFooter2draftCreate = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Guardar',
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    onClick: e => this.onCreate.emit({
                        event: e,
                        sender: this,
                        notaVenta: this.notaVenta
                    })
                },
                {
                    title: 'Emitir',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.onIssue.emit({
                        event: e,
                        sender: this,
                        notaVenta: this.notaVenta
                    })
                }
            ]
        });
    };

    buttonsFooter2draftUpdate = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Actualizar',
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    onClick: e => this.onUpdate.emit({
                        event: e,
                        sender: this,
                        notaVenta: this.notaVenta
                    })
                },
                {
                    title: 'Eliminar',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => this.onDelete.emit({
                        event: e,
                        sender: this,
                        notaVenta: this.notaVenta
                    })
                },
                {
                    title: 'Emitir',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.onIssue.emit({
                        event: e,
                        sender: this,
                        notaVenta: this.notaVenta
                    })
                }
            ]
        });
    };

    buttonsFooter2issued = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Anular',
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    onClick: e => this.onCancel.emit({
                        event: e,
                        sender: this,
                        notaVenta: this.notaVenta
                    })
                }
            ]
        });
    };

    buttonsFooter2canceled = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: []
        });
    }


    @Output() readonly onInit = new EventEmitter<NotaVentaComponent>();
    @Output() readonly onDestroy = new EventEmitter<NotaVentaComponent>();
    @Output() readonly onClose = new EventEmitter<NotaVentaComponentEventData>();

    @Output() readonly onCreate = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onUpdate = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onDelete = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onIssue = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onCancel = new EventEmitter<NotaVentaComponentEventData>();


    StateObjectComponent = StateObjectComponent;
    sub: Subscription = new Subscription();
    stateDocument = StateDocumentNotaVentaComponent.draftCreate;
    StateDocumentNotaVentaComponent = StateDocumentNotaVentaComponent;
    modalService = inject( ModalService );
    clienteService = inject( ClienteService );
    documentoIdentificacionService = inject( DocumentoIdentificacionService );
    elementoEconomicoService = inject( ElementoEconomicoService );
    buttonsFooterLength = 0;


    constructor()
    {
        NotaVentaComponent.id++;
        this.instanceId = NotaVentaComponent.id;
    }


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storeNotaVenta.state$.subscribe( state => {
            
            this.notaVenta = state;
            this.stateDocument = this.notaVenta.fechaAnulacion
                                ? StateDocumentNotaVentaComponent.canceled
                                : this.notaVenta.fechaEmision
                                    ? StateDocumentNotaVentaComponent.issued
                                    : this.notaVenta.fechaCreacion
                                        ? StateDocumentNotaVentaComponent.draftUpdate
                                        : StateDocumentNotaVentaComponent.draftCreate;

            if ( this.stateDocument === StateDocumentNotaVentaComponent.draftCreate ) {
                this.buttonsFooter2draftCreate();
            }
            else if ( this.stateDocument === StateDocumentNotaVentaComponent.draftUpdate ) {
                this.buttonsFooter2draftUpdate();
            }
            else if ( this.stateDocument === StateDocumentNotaVentaComponent.issued ) {
                this.buttonsFooter2issued();
            }
            else if ( this.stateDocument === StateDocumentNotaVentaComponent.canceled ) {
                this.buttonsFooter2canceled();
            }       

        } ) );

        this.sub.add( this.storeNotaVenta.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );

        this.sub.add( this.buttonsFooterComponentVm$.subscribe( vm => this.buttonsFooterLength = vm.buttonsHtml.length ) )

        this.storeNotaVenta.getRead().subscribe();
    }

    // select
    selectCliente()
    {
        this.clienteService.openTableComponent2selectItem().subscribe( c => {

            c.sub.add( c.store.state$.subscribe( state => 
                this.notaVenta.cliente 
                ? c.setDataChecked( [this.notaVenta.cliente] ) 
                : undefined ) 
            )

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta(
                    notaVenta.setCliente( e.item )
                ) )
            } ) );

        } )
    }

    // select
    selectReceptorDocumentoIdentificacion()
    {
        this.documentoIdentificacionService.openTableComponent2selectItem().subscribe( c => {

            c.sub.add( c.store.state$.subscribe( state => 
                this.notaVenta.receptorDocumentoIdentificacion
                ? c.setDataChecked( [this.notaVenta.receptorDocumentoIdentificacion] )
                : undefined
            ) );

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta(
                    notaVenta.setReceptorDocumentoIdentificacion( e.item )
                ) )
            } ) )

        } )
    }

    // select
    selectLiquidacionTipo( id: 1 | 2 )
    {
        this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.setLiquidacionTipo( id ) ) );
    }


    searchElementoEconomicoPorCodigo()
    {
        this.elementoEconomicoService.objectComponentPorCodigo( 
            new ElementoEconomico({ codigo: this.codigoElementoEconomico2search }) 
        )
        .subscribe({
            next: c => {
            
                c.sub.add( c.onCreate.subscribe( ({ event, item: elementoEconomico }) => {
                    this.openDetalleComponent( 
                        StateObjectComponent.create,
                        new NotaVentaDetalle({
                            elementoEconomico: elementoEconomico,
                            concepto: `${elementoEconomico.nombre ?? ''} ${elementoEconomico.magnitudNombre ?? ''}`,
                            cantidad: 1,
                            importeUnitario: elementoEconomico.precioUnitario
                        })
                        .calcularImportes()
                    )

                    c.close( event );
                } ) )
    
            },
            error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
        })
    }

    // select
    selectElementoEconomico()
    {}

    // component
    openDetalleComponent( state: StateObjectComponent, detalle: NotaVentaDetalle )
    {
        this.modalService.open( ObjectComponent<NotaVentaDetalle> ).subscribe( c => {

            c.store.setRead( () => new NotaVentaDetalle( detalle ) )
                    .getRead()
                    .subscribe();

            c.vm$.next({
                title: 'Detalle',
                isCloseActive: true,
                state: ( this.stateDocument === StateDocumentNotaVentaComponent.draftCreate || this.stateDocument === StateDocumentNotaVentaComponent.draftUpdate )
                        ? state
                        : StateObjectComponent.none,
                bindingProperties: [
                    { title: 'Código', getValue: item => item.elementoEconomico?.codigo, readonly: true, behavior: PropBehavior.string },
                    { title: 'Concepto', getValue: item => item.concepto, setValue: ( item, value ) => item.set({ concepto: value }), behavior: PropBehavior.string },
                    { title: 'Precio Uni.', getValue: item => item.importeUnitario, setValue: ( item, value ) => item.set({ importeUnitario: value }).calcularImportes(), behavior: PropBehavior.number },
                    { title: 'Cantidad', getValue: item => item.cantidad, setValue: ( item, value ) => item.set({ cantidad: value }).calcularImportes(), behavior: PropBehavior.number },
                    { title: 'Descuento', getValue: item => item.importeDescuento, setValue: ( item, value ) => item.set({ importeDescuento: value }).calcularImportes(), behavior: PropBehavior.number },
                    { title: 'Importe', getValue: item => item.importeNeto, readonly: true, behavior: PropBehavior.number },
                    { title: 'Comentario', getValue: item => item.comentario, setValue: ( item, value ) => item.set({ comentario: value }), behavior: PropBehavior.text },
                ]
            });

            c.sub.add( c.onCreate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.agregarDetalle( e.item ) ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onUpdate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.actualizarDetalle( e.item ) ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.eliminarDetalle( e.item ) ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onCancelWrite.subscribe( e => c.close( e.event ) ) );

        } )
    }

    // component
    openAnticipoComponent( state: StateObjectComponent, importe: NotaVentaComponentImporte )
    {
        if ( importe !== this.storeImportes.getState()[ 2 ] ) return;

        this.modalService.open( ObjectComponent<NotaVentaComponentImporte> ).subscribe( c => {

            c.store.setRead( () => ({ ...this.storeImportes.getState()[2] }) )
                    .getRead()
                    .subscribe();

            c.vm$.next({
                title: 'Anticipo',
                isCloseActive: true,
                state: ( this.stateDocument === StateDocumentNotaVentaComponent.draftCreate || this.stateDocument === StateDocumentNotaVentaComponent.draftUpdate )
                        ? state
                        : StateObjectComponent.none,
                bindingProperties: [
                    { title: 'Monto', getValue: item => item.amount, setValue: ( item, value ) => item.amount = value, behavior: PropBehavior.number }
                ]
            });


            c.sub.add( c.onCreate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( 
                    notaVenta.set({ importeAnticipo: e.item.amount }).calcularInformacion()
                ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onUpdate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( 
                    notaVenta.set({ importeAnticipo: e.item.amount }).calcularInformacion()
                ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( 
                    notaVenta.set({ importeAnticipo: 0 }).calcularInformacion()
                ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onCancelWrite.subscribe( e => c.close( e.event ) ) );

        } )
    }

    // component
    openCuotaComponent( state: StateObjectComponent, cuota?: NotaVentaCuota )
    {
        this.modalService.open( ObjectComponent<NotaVentaCuota> ).subscribe( c => {

            c.store.setRead( () => new NotaVentaCuota( cuota ) )
                    .getRead()
                    .subscribe();

            c.vm$.next({
                title: ( 'Cuota' + ` ${cuota?.numero ?? ''}` ).trim(),
                isCloseActive: true,
                state: ( this.stateDocument === StateDocumentNotaVentaComponent.draftCreate || this.stateDocument === StateDocumentNotaVentaComponent.draftUpdate )
                    ? state
                    : StateObjectComponent.none,
                bindingProperties: ( this.storeCuotas.getState().length === 0 || this.storeCuotas.getState()[ 0 ] === cuota )
                                    ? [
                                        { title: 'Fecha Inicio', getValue: item => item.fechaInicio, setValue: ( item, value ) => item.set({ fechaInicio: value }), behavior: PropBehavior.datetime },
                                        { title: 'Fecha Vencimiento', getValue: item => item.fechaVencimiento, setValue: ( item, value ) => item.set({ fechaVencimiento: value }), behavior: PropBehavior.datetime },
                                    ]
                                    : [
                                        { title: 'Fecha Vencimiento', getValue: item => item.fechaVencimiento, setValue: ( item, value ) => item.set({ fechaVencimiento: value }), behavior: PropBehavior.datetime },
                                    ]
            });

            c.sub.add( c.onCreate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta,
                    credito: notaVenta.credito.agregarCuota( e.item )
                }) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onUpdate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta,
                    credito: notaVenta.credito.actualizarCuota( e.item )
                }) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta,
                    credito: notaVenta.credito.eliminarCuota( e.item )
                }) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onCancelWrite.subscribe( e => c.close( e.event ) ) );

        } );
    }


    calcularInformacion()
    {
        this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.calcularInformacion() ) );
    }


    agregarNota( nota: Nota )
    {
        this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.agregarNota( nota ) ) );
    }

    eliminarNota( nota: Nota )
    {
        this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.eliminarNota( nota ) ) );
    }

    close( e: Event )
    {
        this.modalService.close( this );
        this.onClose.emit({
            event: e,
            sender: this,
            notaVenta: this.notaVenta
        })
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeNotaVenta.complete();
        this.storeDetalles.complete();
        this.storeCuotas.complete();
        this.storeImportes.complete();
        this.storeNotas.complete();
        this.sub.unsubscribe();
    }
}


export type NotaVentaComponentEventData =
{
    event: Event,
    sender: NotaVentaComponent,
    notaVenta: NotaVenta
}


export enum StateDocumentNotaVentaComponent
{
    draftCreate,
    draftUpdate,
    issued,
    canceled
}


export type NotaVentaComponentImporte = ItemType &
{
    title: string,
    amount: number
}