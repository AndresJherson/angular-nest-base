import { Component, EventEmitter, HostBinding, inject, Input, Output, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { NotaVenta } from '../../../../../../../models/src/lib/DocumentosTransaccion/NotaVenta/NotaVenta';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
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
import { ObjectComponent, ObjectComponentVm, StateObjectComponent } from '../../Object/Object.component';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { NotaVentaCuota } from 'apps/models/src/lib/DocumentosTransaccion/NotaVenta/NotaVentaCuota';
import { BUTTON_CLASS_BOOTSTRAP } from 'apps/client/src/app/utils/ButtonsClass';
import { ItemType } from 'apps/client/src/app/interfaces/ItemType';
import { Nota } from 'apps/models/src/lib/DocumentosTransaccion/Nota';
import { CollectionNotaComponent } from "../../../CollectionComponents/CollectionNota/CollectionNota.component";
import { DocumentoIdentificacionService } from 'apps/client/src/app/models/Personas/documento-identificacion.service';
import { NotaService } from 'apps/client/src/app/models/DocumentosTransaccion/nota.service';
import { EntradaEfectivo, EntradaPantalla, EntradaProducto, MovimientoEfectivo, MovimientoPantalla, MovimientoProducto, PantallaModeloCalidad, Producto, SalidaEfectivo, SalidaPantalla, SalidaPantallaDetalle, SalidaProducto, SalidaProductoDetalle } from '@app/models';
import { MovimientoEfectivoComponent, StateComponentMovimientoEfectivoComponent } from '../../DocumentosMovimiento/MovimientoEfectivo/MovimientoEfectivo.component';
import { MovimientoEfectivoService } from 'apps/client/src/app/models/DocumentosMovimiento/MovimientoEfectivo/movimiento-efectivo.service';
import { MovimientoPantallaService } from 'apps/client/src/app/models/DocumentosMovimiento/MovimientoPantalla/movimiento-pantalla.service';
import { MovimientoProductoService } from 'apps/client/src/app/models/DocumentosMovimiento/MovimientoProducto/movimiento-producto.service';
import Decimal from 'decimal.js';
import { MovimientoPantallaComponent, StateComponentMovimientoPantallaComponent } from '../../DocumentosMovimiento/MovimientoPantalla/MovimientoPantalla.component';
import { MovimientoProductoComponent, StateComponentMovimientoProductoComponent } from '../../DocumentosMovimiento/MovimientoProducto/MovimientoProducto.component';

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
    CollectionNotaComponent,
    AsyncPipe
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
        .crearBorrador()
    );

    notaVenta: NotaVenta = new NotaVenta();
    codigoElementoEconomico2search = '';

    @Input() vm$ = new BehaviorSubject<NotaVentaComponentVm>({
        stateComponent: StateComponentNotaVentaComponent.read,
        classesCss: '',
        isCloseButtonActive: true
    });

    @HostBinding( 'class' ) hostClasses: string = '';

    buttonsMenuComponentVm$ = new BehaviorSubject<ButtonsMenuComponentVm>({
        buttons: []
    });

    buttonsFooterComponentVm$ = new BehaviorSubject<ButtonsFooterComponentVm>({
        buttonsHtml: []
    });

    @Output() readonly onInit = new EventEmitter<NotaVentaComponent>();
    @Output() readonly onDestroy = new EventEmitter<NotaVentaComponent>();
    @Output() readonly onClose = new EventEmitter<NotaVentaComponentEventData>();

    @Output() readonly onCreate = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onUpdate = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onDelete = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onIssue = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onCancel = new EventEmitter<NotaVentaComponentEventData>();

    @Output() readonly onRead = new EventEmitter<NotaVentaComponentEventData>();
    @Output() readonly onCancelUpdate = new EventEmitter<NotaVentaComponentEventData>();


    StateObjectComponent = StateObjectComponent;
    sub: Subscription = new Subscription();
    stateDocument = StateDocumentNotaVentaComponent.draft;
    StateDocumentNotaVentaComponent = StateDocumentNotaVentaComponent;
    StateComponentNotaVentaComponent = StateComponentNotaVentaComponent;
    StateComponentMovimientoEfectivoComponent = StateComponentMovimientoEfectivoComponent;
    StateComponentMovimientoPantallaComponent = StateComponentMovimientoPantallaComponent;
    StateComponentMovimientoProductoComponent = StateComponentMovimientoProductoComponent;
    Prop = Prop;
    Object = Object;

    modalService = inject( ModalService );
    clienteService = inject( ClienteService );
    documentoIdentificacionService = inject( DocumentoIdentificacionService );
    elementoEconomicoService = inject( ElementoEconomicoService );
    notaService = inject( NotaService );
    movimientoEfectivoService = inject( MovimientoEfectivoService );
    movimientoPantallaService = inject( MovimientoPantallaService );
    movimientoProductoService = inject( MovimientoProductoService );
    buttonsFooterLength = 0;



    // Notas
    storeNotas = this.storeNotaVenta.storeFromThis( notaVenta => [...notaVenta.notas] );

    agregarNota( nota: Nota )
    {
        if ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create ) {
            this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.agregarNota( nota ) ) );
        }
        else {
            // guardado automatico
            nota.set({
                fechaCreacion: nota.fechaCreacion ?? Prop.toDateTimeNow().toSQL(),
                documentoTransaccion: new NotaVenta({ id: this.notaVenta.id, uuid: this.notaVenta.uuid, symbol: this.notaVenta.symbol, codigoSerie: this.notaVenta.codigoSerie, codigoNumero: this.notaVenta.codigoNumero })
            })

            this.notaService.createItem( nota ).subscribe({
                next: data => this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta.agregarNota( data )
                }) ),
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            });
        }
    }

    eliminarNota( nota: Nota )
    {
        if ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create ) {
            this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.eliminarNota( nota ) ) );
        }
        else {
            // eliminacíon automatico
            nota.set({
                fechaCreacion: nota.fechaCreacion ?? Prop.toDateTimeNow().toSQL(),
                documentoTransaccion: new NotaVenta({ id: this.notaVenta.id, uuid: this.notaVenta.uuid, symbol: this.notaVenta.symbol, codigoSerie: this.notaVenta.codigoSerie, codigoNumero: this.notaVenta.codigoNumero })
            })

            this.notaService.deleteItem( nota ).subscribe({
                next: () => this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta.eliminarNota( nota )
                }) ),
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            });
        }
    }



    // Detalles
    detallesTableComponentVmBindingProperties: TableComponentVm<NotaVentaDetalle>['bindingProperties'] = [
        { title: 'Código', getValue: detalle => detalle.elementoEconomico?.codigo, behavior: PropBehavior.string },
        { title: 'Concepto', getValue: detalle => detalle.concepto, behavior: PropBehavior.string },
        { title: 'Cantidad', getValue: detalle => Prop.toDecimal( detalle.cantidad ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: 'Precio Uni.', getValue: detalle => Prop.toDecimal( detalle.importeUnitario ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: 'Descuento', getValue: detalle => Prop.toDecimal( detalle.importeDescuento ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: 'Precio Uni. Promedio', getValue: item => Prop.toDecimal( item.importeUnitarioPromedio ).toFixed( 2 ), behavior: PropBehavior.number },
        { title: 'Importe', getValue: detalle => Prop.toDecimal( detalle.importeNeto ).toFixed( 2 ), behavior: PropBehavior.number },
    ];

    detalleTableComponentOnInit( c: TableComponent<NotaVentaDetalle> )
    {
        c.store = this.storeNotaVenta.storeFromThis( notaVenta => notaVenta.detalles.map( item => new NotaVentaDetalle( item ) ) );

        c.vm$.next({
            title: 'Detalles',
            classesCss: '',
            isHeadActive: true,
            isCloseButtonActive: false,
            stateRow: StateRowTableComponent.select,
            bindingProperties: this.detallesTableComponentVmBindingProperties
        });


        const onSelect2MovimientoPantalla = new EventEmitter();
        const onSelect2MovimientoProducto = new EventEmitter();

        c.sub.add( this.storeNotaVenta.state$.subscribe( state => {

            if ( state.detalles.length > 0 ) {

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Generar Salida de Pantallas',
                            onClick: e => onSelect2MovimientoPantalla.emit()
                        },
                        {
                            title: 'Generar Salida de Productos',
                            onClick: e => onSelect2MovimientoProducto.emit()
                        }
                    ]
                });

            }
            else {

                c.buttonsMenuComponentVm$.next({
                    buttons: []
                });
                
            }

        } ) );
        

        c.sub.add( onSelect2MovimientoPantalla.subscribe( () => {

            this.detalleTableComponent2selectItems().subscribe( tc => {

                tc.store = this.storeNotaVenta.storeFromThis( state => state.detalles.filter( detalle => detalle.elementoEconomico instanceof PantallaModeloCalidad ) );

                tc.sub.add( tc.onSelectItems.subscribe( e => {

                    const salidaPantalla = new SalidaPantalla({
                        detalles: e.data.map( detalle => new SalidaPantallaDetalle({
                            pantallaModeloCalidad: detalle.elementoEconomico,
                            cantidad: detalle.cantidad,
                            importeUnitario: detalle.importeUnitarioPromedio
                        }) )
                    }).procesarInformacionMovimiento()

                    if ( 
                        ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create ||
                        this.vm$.value.stateComponent === StateComponentNotaVentaComponent.update ) &&
                        this.stateDocument === StateDocumentNotaVentaComponent.issued
                    ) {
                        this.openMovimientoPantallaComponent2write( StateComponentMovimientoPantallaComponent.createMemory, salidaPantalla )
                    }
                    else if (
                        this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read &&
                        this.stateDocument === StateDocumentNotaVentaComponent.issued
                    ) {
                        this.openMovimientoPantallaComponent2write( StateComponentMovimientoPantallaComponent.createServer, salidaPantalla )
                    }

                } ) );

            } )

        } ) );

        c.sub.add( onSelect2MovimientoProducto.subscribe( () => {

            this.detalleTableComponent2selectItems().subscribe( tc => {

                tc.store = this.storeNotaVenta.storeFromThis( state => state.detalles.filter( detalle => detalle.elementoEconomico instanceof Producto ) );

                tc.sub.add( tc.onSelectItems.subscribe( e => {

                    const salidaProducto = new SalidaProducto({
                        detalles: e.data.map( detalle => new SalidaProductoDetalle({
                            producto: detalle.elementoEconomico,
                            cantidad: detalle.cantidad,
                            importeUnitario: detalle.importeUnitarioPromedio
                        }) )
                    }).procesarInformacionMovimiento()

                    if ( 
                        ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create ||
                        this.vm$.value.stateComponent === StateComponentNotaVentaComponent.update ) &&
                        this.stateDocument === StateDocumentNotaVentaComponent.issued
                    ) {
                        this.openMovimientoProductoComponent2write( StateComponentMovimientoProductoComponent.createMemory, salidaProducto )
                    }
                    else if (
                        this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read &&
                        this.stateDocument === StateDocumentNotaVentaComponent.issued
                    ) {
                        this.openMovimientoProductoComponent2write( StateComponentMovimientoProductoComponent.createServer, salidaProducto )
                    }

                } ) );

            } )

        } ) );

    }

    detalleTableComponent2selectItems()
    {
        return this.modalService.open( TableComponent<NotaVentaDetalle> ).pipe(
            tap( c => {

                c.vm$.next({
                    title: 'Seleccionar detalles',
                    isHeadActive: true,
                    isCloseButtonActive: true,
                    stateRow: StateRowTableComponent.checkBox,
                    isStateRowCustom: true,
                    bindingProperties: this.detallesTableComponentVmBindingProperties
                })

                c.buttonsFooterComponentVm$.next({
                    buttonsHtml: [
                        {
                            title: 'Cancelar',
                            class: BUTTON_CLASS_BOOTSTRAP.light,
                            onClick: e => c.close( e )
                        },
                        {
                            title: 'Confimar',
                            class: BUTTON_CLASS_BOOTSTRAP.primary,
                            onClick: e => {
                                const data = c.getDataChecked();
                                c.onSelectItems.emit({
                                    event: e,
                                    sender: c,
                                    data
                                })
                                c.close( e )
                            }
                        }
                    ]
                });

            } )
        )
    }

    searchElementoEconomicoPorCodigo()
    {
        this.elementoEconomicoService.objectComponentPorCodigo( 
            new ElementoEconomico({ codigo: this.codigoElementoEconomico2search }) 
        )
        .subscribe({
            next: c => {
            
                this.codigoElementoEconomico2search = '';

                c.sub.add( c.onCreate.subscribe( ({ event, item: elementoEconomico }) => {

                    this.openDetalleComponent( 
                        StateObjectComponent.create,
                        new NotaVentaDetalle({
                            elementoEconomico: elementoEconomico,
                            concepto: `${elementoEconomico.nombre ?? ''} ${elementoEconomico.magnitudNombre ?? ''}`.trim(),
                            cantidad: 1,
                            importeUnitario: elementoEconomico.precioUnitario
                        })
                        .calcularImportes()
                    )

                    c.close( event );

                } ) )
    
            },
            error: error => {
                this.codigoElementoEconomico2search = '';
                this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            }
        })
    }

    newDetalleComponent()
    {
        this.openDetalleComponent( StateObjectComponent.create, new NotaVentaDetalle() );
    }

    openDetalleComponent( state: StateObjectComponent, detalle: NotaVentaDetalle )
    {
        this.modalService.open( ObjectComponent<NotaVentaDetalle> ).subscribe( c => {

            c.store.setRead( () => new NotaVentaDetalle( detalle ) )
                    .getRead()
                    .subscribe();

            c.vm$.next({
                title: 'Detalle',
                isCloseButtonActive: true,
                isReadButtonActive: false,
                state: this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read || this.vm$.value.stateComponent === StateComponentNotaVentaComponent.none
                        ? StateObjectComponent.none
                        : state,
                bindingProperties: [
                    { title: 'Código', getValue: item => item.elementoEconomico?.codigo, readonly: true, behavior: PropBehavior.string },
                    { title: 'P/S', 
                        getValue: item => item.elementoEconomico?.nombre, 
                        setValue: ( item, value ) => item.set({ elementoEconomico: value }),
                        behavior: PropBehavior.model, 
                        onClick: item => {
                            this.elementoEconomicoService.openTableComponent2selectItem().subscribe( tc => {

                                tc.sub.add( tc.store.state$.subscribe( () => 
                                    item.elementoEconomico
                                    ? tc.setDataChecked([ item.elementoEconomico ])
                                    : undefined
                                ) );

                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( 
                                        detalle => new NotaVentaDetalle({
                                            ...detalle,
                                            elementoEconomico: e.item,
                                            concepto: `${e.item.nombre ?? ''} ${e.item.magnitudNombre ?? ''}`.trim(),
                                            cantidad: 0,
                                            importeUnitario: e.item.precioUnitario,
                                        })
                                        .calcularImportes() 
                                    )
                                } ) );

                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( 
                                        detalle => new NotaVentaDetalle({
                                            ...detalle,
                                            elementoEconomico: e.item,
                                            concepto: '',
                                            cantidad: 0,
                                            importeUnitario: 0
                                        })
                                        .calcularImportes()
                                    )
                                } ) );

                            } )
                        } 
                    },
                    { title: 'Concepto', getValue: item => item.concepto, setValue: ( item, value ) => item.set({ concepto: value }), behavior: PropBehavior.string },
                    { 
                        title: 'Precio Uni.', 
                        getValue: ( item, original ) => 
                            original 
                                ? item.importeUnitario 
                                : Prop.toDecimal( item.importeUnitario ).toFixed( 2 ),
                        setValue: ( item, value ) => item.set({ importeUnitario: value }).calcularImportes(), 
                        behavior: PropBehavior.number 
                    },
                    { 
                        title: 'Cantidad', 
                        getValue: ( item, original ) => 
                            original
                                ? item.cantidad
                                : Prop.toDecimal( item.cantidad ).toFixed( 2 ),
                        setValue: ( item, value ) => item.set({ cantidad: value }).calcularImportes(), 
                        behavior: PropBehavior.number 
                    },
                    { 
                        title: 'Descuento', 
                        getValue: ( item, original ) => 
                            original
                                ? item.importeDescuento
                                : Prop.toDecimal( item.importeDescuento ).toFixed( 2 ),
                        setValue: ( item, value ) => item.set({ importeDescuento: value }).calcularImportes(), 
                        behavior: PropBehavior.number 
                    },
                    { title: 'Importe', 
                        getValue: ( item, original ) => 
                            original
                                ? item.importeNeto
                                : Prop.toDecimal( item.importeNeto ).toFixed( 2 ),
                        readonly: true, 
                        behavior: PropBehavior.number 
                    },
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

            c.sub.add( c.onCancelUpdate.subscribe( e => c.close( e.event ) ) );

        } )
    }



    // Importes
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
        classesCss: '',
        isHeadActive: false,
        isCloseButtonActive: false,
        stateRow: StateRowTableComponent.select,
        bindingProperties: [
            { title: 'Titulo', getValue: item => item.title, behavior: PropBehavior.string },
            { title: 'Importe', getValue: item => Prop.toDecimal( item.amount ).toFixed( 2 ), behavior: PropBehavior.number }
        ]
    });



    // Cuotas
    @ViewChild( 'tableComponentCuotas' ) tableComponentCuotas?: TableComponent<NotaVentaCuota>;

    tableComponentCuotasOnInit( c: TableComponent<NotaVentaCuota> )
    {
        c.store = this.storeNotaVenta.storeFromThis( notaVenta => notaVenta.credito.cuotas.map( item => new NotaVentaCuota( item ) ) );

        c.vm$.next({
            title: '',
            classesCss: '',
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
    }
    
    newCuotaComponent(){
        this.openCuotaComponent( StateObjectComponent.create, new NotaVentaCuota() );
    }

    openCuotaComponent( state: StateObjectComponent, cuota: NotaVentaCuota )
    {
        this.modalService.open( ObjectComponent<NotaVentaCuota> ).subscribe( c => {

            const store = this.tableComponentCuotas?.store;

            c.store.setRead( () => new NotaVentaCuota( cuota ) )
                    .getRead()
                    .subscribe();


            const stateObjectComponent = this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read || 
                                        this.vm$.value.stateComponent === StateComponentNotaVentaComponent.none
                                            ? StateObjectComponent.none
                                            : state;

            const bindingPropertiesCuota: ObjectComponentVm<NotaVentaCuota>[ 'bindingProperties' ] = [
                { 
                    title: 'Fecha Inicio', 
                    behavior: PropBehavior.datetime,
                    setValue: store && ( store.getState().length === 0 || store.getState()[ 0 ] === cuota )
                                ? ( item, value ) => item.set({ fechaInicio: value })
                                : undefined,
                    getValue: ( item, original ) => 
                        original
                            ? item.fechaInicio
                        : Prop.toDateTime( item.fechaInicio ).isValid 
                            ? Prop.toDateTime( item.fechaInicio ).toFormat( 'dd/MM/yyyy HH:mm' ) 
                            : '-'
                },
                { 
                    title: 'Fecha Vencimiento', 
                    behavior: PropBehavior.datetime,
                    setValue: ( item, value ) => item.set({ fechaVencimiento: value }),
                    getValue: ( item, original ) => 
                        original
                            ? item.fechaVencimiento
                        : Prop.toDateTime( item.fechaVencimiento ).isValid 
                            ? Prop.toDateTime( item.fechaVencimiento ).toFormat( 'dd/MM/yyyy HH:mm' ) 
                            : '-'
                },
                { title: 'Importe Amortización', getValue: item => Prop.toDecimal( item.importeAmortizacion ).toFixed( 2 ), behavior: PropBehavior.number },
                { title: 'Importe Interes', getValue: item => Prop.toDecimal( item.importeInteres ).toFixed( 2 ), behavior: PropBehavior.number },
                { title: 'Importe Cuota', getValue: item => Prop.toDecimal( item.importeCuota ).toFixed( 2 ), behavior: PropBehavior.number },
            ];


            c.vm$.next({
                title: ( 'Cuota' + ` ${cuota?.numero ?? ''}` ).trim(),
                classesCss: '',
                isCloseButtonActive: true,
                isReadButtonActive: false,
                state: stateObjectComponent,
                bindingProperties: bindingPropertiesCuota
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

            c.sub.add( c.onCancelUpdate.subscribe( e => c.close( e.event ) ) );

        } );
    }



    // Movimientos Efectivo 
    movimientosEfectivoTableComponentOnInit( c: TableComponent<MovimientoEfectivo> )
    {
        c.store = this.storeNotaVenta.storeFromThis( state => state.movimientosEfectivo );
        c.sub.add( c.store.state$.subscribe( () => this.procesarMedidasMovimientoEfectivo( c.store.getState() ) ) );

        c.vm$.next({
            title: 'Movimientos de Efectivo',
            classesCss: '',
            isHeadActive: true,
            isCloseButtonActive: false,
            stateRow: StateRowTableComponent.select,
            bindingProperties: [
                { title: 'Codigo', getValue: item => item.codigo, behavior: PropBehavior.string },
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
                { title: 'Concepto', getValue: item => item.concepto, behavior: PropBehavior.string },
                { title: 'Fecha Emisión', getValue: item => Prop.toDateTime( item.fechaEmision ).isValid ? Prop.toDateTime( item.fechaEmision ).toFormat( 'dd/MM/yyyy HH:mm' ) : '', behavior: PropBehavior.datetime },
                { title: 'Fecha Anulación', getValue: item => Prop.toDateTime( item.fechaAnulacion ).isValid ? Prop.toDateTime( item.fechaAnulacion ).toFormat( 'dd/MM/yyyy HH:mm' ) : '', behavior: PropBehavior.datetime },
                { title: 'Medio', getValue: item => item.medioTransferencia?.nombre, behavior: PropBehavior.string },
                { 
                    title: 'Valor', 
                    getValue: item => 
                        item instanceof EntradaEfectivo
                            ? Prop.toDecimal( item.importeNeto ).toFixed( 2 )
                        : item instanceof SalidaEfectivo
                            ? `- ${Prop.toDecimal( item.importeNeto ).toFixed( 2 )}`
                            : Prop.toDecimal( item.importeNeto ).toFixed( 2 ),
                    behavior: PropBehavior.number 
                },
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
            ]
        });

        c.sub.add( this.vm$.subscribe( vm => {

            if ( 
                ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create || 
                this.vm$.value.stateComponent === StateComponentNotaVentaComponent.update ) && 
                this.stateDocument === StateDocumentNotaVentaComponent.issued
            ) {
                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Entrada',
                            onClick: e => this.openMovimientoEfectivoComponent( StateComponentMovimientoEfectivoComponent.createMemory, new EntradaEfectivo() )
                        },
                        {
                            title: 'Salida',
                            onClick: e => this.openMovimientoEfectivoComponent( StateComponentMovimientoEfectivoComponent.createMemory, new SalidaEfectivo() )
                        },
                    ]
                });
            }
            else if (
                this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read && 
                this.stateDocument === StateDocumentNotaVentaComponent.issued
            )
            {
                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Entrada',
                            onClick: e => this.openMovimientoEfectivoComponent( StateComponentMovimientoEfectivoComponent.createServer, new EntradaEfectivo() )
                        },
                        {
                            title: 'Salida',
                            onClick: e => this.openMovimientoEfectivoComponent( StateComponentMovimientoEfectivoComponent.createServer, new SalidaEfectivo() )
                        },
                    ]
                });
            }
            else {
                c.buttonsMenuComponentVm$.next({
                    buttons: []
                });
            }

        } ) );

    }

    medidasMovimientosEfectivo = {
        cantidadMovimientos: 0,
        cantidadPorMedioTransferencia: {} as Record<string,number>,
        sumatoriaValor: 0
    };

    procesarMedidasMovimientoEfectivo( movimientosEfectivo: MovimientoEfectivo[] )
    {
        this.medidasMovimientosEfectivo = {
            cantidadMovimientos: movimientosEfectivo.length,
            cantidadPorMedioTransferencia: 
                movimientosEfectivo.filter( mov => mov.fechaAnulacion === undefined )
                .reduce(
                    ( record, mov ) => {

                        if ( !mov.medioTransferencia?.nombre ) return record;

                        if ( !( mov.medioTransferencia.nombre in record ) ) {
                            record[mov.medioTransferencia.nombre] = mov.importeNeto;
                        }
                        else {
                            record[mov.medioTransferencia.nombre] = 
                                mov instanceof EntradaEfectivo
                                    ? new Decimal( record[mov.medioTransferencia.nombre] )
                                        .plus( mov.importeNeto )
                                        .toDecimalPlaces( 2 )
                                        .toNumber()
                                : mov instanceof SalidaEfectivo
                                    ? new Decimal( record[mov.medioTransferencia.nombre] )
                                        .minus( mov.importeNeto )
                                        .toDecimalPlaces( 2 )
                                        .toNumber()
                                    : record[mov.medioTransferencia.nombre];
                        }

                        return record;
                    },
                    {} as Record<string,number>
                ),
            sumatoriaValor: 
                movimientosEfectivo.filter( mov => mov.fechaAnulacion === undefined )
                .reduce(
                    ( decimal, mov ) => {
                        decimal = mov instanceof EntradaEfectivo
                                    ? decimal.plus( mov.importeNeto )
                                : mov instanceof SalidaEfectivo
                                    ? decimal.minus( mov.importeNeto )
                                    : decimal;
                            
                        return decimal;
                    },
                    new Decimal( 0 )
                )
                .toDecimalPlaces( 2 )
                .toNumber()
        }
    }

    openMovimientoEfectivoComponent( state: StateComponentMovimientoEfectivoComponent, movimientoEfectivo: MovimientoEfectivo )
    {
        this.modalService.open( MovimientoEfectivoComponent ).subscribe( c => {

            c.storeMovimientoEfectivo.setRead( 
                () => MovimientoEfectivo.initialize([ movimientoEfectivo ])[0].set({
                    documentoTransaccion: new NotaVenta({ id: this.notaVenta.id, uuid: this.notaVenta.uuid, symbol: this.notaVenta.symbol, codigoSerie: this.notaVenta.codigoSerie, codigoNumero: this.notaVenta.codigoNumero })
                })
            )
            .getRead()
            .subscribe();

            
            const statesMemory = [ 
                StateComponentMovimientoEfectivoComponent.createMemory,
                StateComponentMovimientoEfectivoComponent.updateMemory,
                StateComponentMovimientoEfectivoComponent.readMemory
            ]

            const statesServer = [
                StateComponentMovimientoEfectivoComponent.createServer,
                StateComponentMovimientoEfectivoComponent.readServer,
            ]

            
            const stateComponentMovimientoEfectivo = 
                ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create ||
                this.vm$.value.stateComponent === StateComponentNotaVentaComponent.update ) &&
                statesMemory.includes( state )
                    ? state
                : this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read && 
                this.stateDocument !== StateDocumentNotaVentaComponent.draft &&
                statesServer.includes( state )
                    ? state
                    : StateComponentMovimientoEfectivoComponent.none;


            c.vm$.next({
                title: movimientoEfectivo instanceof EntradaEfectivo
                        ? 'Entrada de Efectivo'
                    : movimientoEfectivo instanceof SalidaEfectivo
                        ? 'Salida de Efectivo'
                        : 'Movimiento de Efectivo',
                stateComponent: stateComponentMovimientoEfectivo,
                isAttached: false,
                classesCss: ''
            });


            c.sub.add( c.onCreate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.agregarMovimientoEfectivo( e.movimientoEfectivo ) ) )
            } ) )

            c.sub.add( c.onUpdate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.actualizarMovimientoEfectivo( e.movimientoEfectivo ) ) )
            } ) );

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.eliminarMovimientoEfectivo( e.movimientoEfectivo ) ) )
            } ) );


            c.sub.add( c.onIssue.subscribe( e => {

                this.movimientoEfectivoService.createItem( MovimientoEfectivo.initialize([ e.movimientoEfectivo ])[0].emitir() ).subscribe({
                    next: data => {

                        this.storeNotaVenta.getRead()
                        .subscribe( () => {

                            c.storeMovimientoEfectivo.setRead( () => MovimientoEfectivo.initialize([ this.notaVenta.getMovimientoEfectivo( data ) ])[0] )
                            .getRead()
                            .subscribe({
                                next: () => c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoEfectivoComponent.readServer }),
                                error: error => c.close( e.event )
                            });

                        } )

                    },
                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                })

            } ) );

            c.sub.add( c.onCancel.subscribe( e => {

                this.movimientoEfectivoService.updateItemCancel( MovimientoEfectivo.initialize([ e.movimientoEfectivo ])[0].anular() ).subscribe({
                    next: data => {

                        this.storeNotaVenta.getRead()
                        .subscribe( () => {

                            c.storeMovimientoEfectivo.setRead( () => MovimientoEfectivo.initialize([ this.notaVenta.getMovimientoEfectivo( data ) ])[0] )
                            .getRead()
                            .subscribe({
                                next: () => c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoEfectivoComponent.readServer }),
                                error: error => c.close( e.event )
                            });

                        } )

                    },
                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                })

            } ) );

        } );
    }



    // Movimientos Pantalla
    movimientosPantallaTableComponentOnInit( c: TableComponent<MovimientoPantalla> )
    {
        c.store = this.storeNotaVenta.storeFromThis( state => state.movimientosPantalla );

        c.vm$.next({
            title: 'Movimientos de Pantalla',
            classesCss: '',
            isHeadActive: true,
            isCloseButtonActive: false,
            stateRow: StateRowTableComponent.select,
            bindingProperties: [
                { title: 'Codigo', getValue: item => item.codigo, behavior: PropBehavior.string },
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
                { title: 'Concepto', getValue: item => item.concepto, behavior: PropBehavior.string },
                { title: 'Fecha Emisión', getValue: item => Prop.toDateTime( item.fechaEmision ).isValid ? Prop.toDateTime( item.fechaEmision ).toFormat( 'dd/MM/yyyy HH:mm' ) : '', behavior: PropBehavior.datetime },
                { title: 'Fecha Anulación', getValue: item => Prop.toDateTime( item.fechaAnulacion ).isValid ? Prop.toDateTime( item.fechaAnulacion ).toFormat( 'dd/MM/yyyy HH:mm' ) : '', behavior: PropBehavior.datetime },
                { 
                    title: 'Valor', 
                    getValue: item => Prop.toDecimal( item.importeNeto ).toFixed( 2 ),
                    behavior: PropBehavior.number 
                },
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
            ]
        });


        c.sub.add( this.vm$.subscribe( vm => {

            if ( 
                ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create || 
                this.vm$.value.stateComponent === StateComponentNotaVentaComponent.update ) && 
                this.stateDocument === StateDocumentNotaVentaComponent.issued
            ) {
                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Entrada',
                            onClick: e => this.openMovimientoPantallaComponent2write( StateComponentMovimientoPantallaComponent.createMemory, new EntradaPantalla() )
                        },
                        {
                            title: 'Salida',
                            onClick: e => this.openMovimientoPantallaComponent2write( StateComponentMovimientoPantallaComponent.createMemory, new SalidaPantalla() )
                        },
                    ]
                });
            }
            else if (
                this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read && 
                this.stateDocument === StateDocumentNotaVentaComponent.issued
            )
            {
                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Entrada',
                            onClick: e => this.openMovimientoPantallaComponent2write( StateComponentMovimientoPantallaComponent.createServer, new EntradaPantalla() )
                        },
                        {
                            title: 'Salida',
                            onClick: e => this.openMovimientoPantallaComponent2write( StateComponentMovimientoPantallaComponent.createServer, new SalidaPantalla() )
                        },
                    ]
                });
            }
            else {
                c.buttonsMenuComponentVm$.next({
                    buttons: []
                });
            }

        } ) );
    }

    openMovimientoPantallaComponent2read( 
        state: StateComponentMovimientoPantallaComponent.readMemory |
            StateComponentMovimientoPantallaComponent.readServer |
            StateComponentMovimientoPantallaComponent.none,
        movimientoPantalla: MovimientoPantalla 
    )
    {
        this.modalService.open( MovimientoPantallaComponent ).subscribe( c => {

            c.storeMovimientoPantalla.setRead( 
                () => MovimientoPantalla.initialize([ movimientoPantalla ])[0].set({
                    documentoTransaccion: new NotaVenta({ id: this.notaVenta.id, uuid: this.notaVenta.uuid, symbol: this.notaVenta.symbol, codigoSerie: this.notaVenta.codigoSerie, codigoNumero: this.notaVenta.codigoNumero })
                })
            )
            .getRead()
            .subscribe();

            c.vm$.next({
                title: movimientoPantalla instanceof EntradaPantalla
                        ? 'Entrada de Pantalla'
                    : movimientoPantalla instanceof SalidaPantalla
                        ? 'Salida de Pantalla'
                        : 'Movimiento de Pantalla',
                stateComponent: state,
                isStateComponentCustom: 
                    state === StateComponentMovimientoPantallaComponent.readMemory
                        ? true
                        : false,
                isHeadActive: true,
                isCloseButtonActive: false,
                isAttached: false,
                classesCss: ''
            });


            if ( state === StateComponentMovimientoPantallaComponent.readMemory ) {

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Actualizar',
                            onClick: e => {
                                c.close( e );
                                this.openMovimientoPantallaComponent2write( StateComponentMovimientoPantallaComponent.updateMemory, movimientoPantalla );
                            }
                        },
                        {
                            title: 'Eliminar',
                            onClick: e => c.delete( e )
                        },
                    ]
                });

            }

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.eliminarMovimientoPantalla( e.movimientoPantalla ) }) )
                c.close( e.event )
            } ) );


            c.sub.add( c.onCancel.subscribe( e => {

                this.movimientoPantallaService.updateItemCancel( MovimientoPantalla.initialize([ e.movimientoPantalla ])[0].anular() ).subscribe({
                    next: data => {

                        this.storeNotaVenta.getRead()
                        .subscribe( () => {

                            c.storeMovimientoPantalla.setRead( () => MovimientoPantalla.initialize([ this.notaVenta.getMovimientoPantalla( data ) ])[0] )
                            .getRead()
                            .subscribe({
                                next: () => c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoPantallaComponent.readServer }),
                                error: error => c.close( e.event )
                            });

                        } )

                    },
                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                })

            } ) );

        } );
    }

    openMovimientoPantallaComponent2write( 
        state: StateComponentMovimientoPantallaComponent.createMemory |
            StateComponentMovimientoPantallaComponent.updateMemory |
            StateComponentMovimientoPantallaComponent.createServer ,
        movimientoPantalla: MovimientoPantalla 
    )
    {
        this.modalService.open( TabComponent ).subscribe( c => {
        
            const initialState = MovimientoPantalla.initialize([ movimientoPantalla ])[0].set({
                documentoTransaccion: new NotaVenta({ id: this.notaVenta.id, uuid: this.notaVenta.uuid, symbol: this.notaVenta.symbol, codigoSerie: this.notaVenta.codigoSerie, codigoNumero: this.notaVenta.codigoNumero })
            });

            const store = new ComponentStore(
                MovimientoPantalla.initialize([ initialState ])[0],
                () => MovimientoPantalla.initialize([ initialState ])[0]
            )

            c.vm$.next({
                title: movimientoPantalla instanceof EntradaPantalla
                            ? 'Entrada de Pantalla'
                        : movimientoPantalla instanceof SalidaPantalla
                            ? 'Salida de Pantalla'
                            : 'Movimiento de Pantalla',
                isCloseActive: true,
                classesCss: '!tw-min-h-0 !tw-w-auto tw-rounded tw-p-4 tw-shadow-md',
                tabs: [
                    {
                        title: 'Registro',
                        component: MovimientoPantallaComponent,
                        active: true,
                        onInit: ( mpc: MovimientoPantallaComponent ) => {

                            mpc.storeMovimientoPantalla.setRead( () => MovimientoPantalla.initialize([ initialState ])[0] );
                            mpc.storeMovimientoPantalla.setState( store.getState() );

                            mpc.vm$.next({
                                title: movimientoPantalla instanceof EntradaEfectivo
                                            ? 'Entrada de Pantalla'
                                        : movimientoPantalla instanceof SalidaEfectivo
                                            ? 'Salida de Pantalla'
                                            : 'Movimiento de Pantalla',
                                stateComponent: state,
                                isStateComponentCustom:
                                    state === StateComponentMovimientoPantallaComponent.updateMemory
                                        ? true
                                        : false,
                                isHeadActive: false,
                                isCloseButtonActive: false,
                                isAttached: false,
                                classesCss: '!tw-p-0 !tw-rounded-none !tw-shadow-none !tw-min-h-full',
                            })


                            if ( state === StateComponentMovimientoPantallaComponent.updateMemory ) {

                                mpc.buttonsMenu2updateMemory();
                                mpc.buttonsFooterComponentVm$.next({
                                    buttonsHtml: [
                                        {
                                            title: 'Cancelar',
                                            class: BUTTON_CLASS_BOOTSTRAP.light,
                                            onClick: e => {
                                                this.openMovimientoPantallaComponent2read( StateComponentMovimientoPantallaComponent.readMemory, initialState );
                                                this.modalService.close( c );
                                            }
                                        },
                                        {
                                            title: 'Confirmar',
                                            class: BUTTON_CLASS_BOOTSTRAP.primary,
                                            onClick: e => mpc.update( e )
                                        },
                                    ]
                                });

                            }


                            mpc.sub.add( mpc.onCreate.subscribe( e => {
                                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.agregarMovimientoPantalla( e.movimientoPantalla ) }) )
                                this.openMovimientoPantallaComponent2read( StateComponentMovimientoPantallaComponent.readMemory, e.movimientoPantalla );
                                this.modalService.close( c );
                            } ) );

                            mpc.sub.add( mpc.onUpdate.subscribe( e => {
                                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.actualizarMovimientoPantalla( e.movimientoPantalla ) }) )
                                this.openMovimientoPantallaComponent2read( StateComponentMovimientoPantallaComponent.readMemory, e.movimientoPantalla );
                                this.modalService.close( c );
                            } ) );

                            mpc.sub.add( mpc.onDelete.subscribe( e => {
                                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.eliminarMovimientoPantalla( e.movimientoPantalla ) }) )
                                this.modalService.close( c );
                            } ) );

                            mpc.sub.add( mpc.onIssue.subscribe( e => {

                                this.movimientoPantallaService.createItem( 

                                    MovimientoPantalla.initialize([ e.movimientoPantalla ])[0]
                                    .emitir() 

                                ).subscribe({
                                    next: data => {
                
                                        this.storeNotaVenta.getRead()
                                        .subscribe( () => {

                                            try {
                                                this.openMovimientoPantallaComponent2read( StateComponentMovimientoPantallaComponent.readServer, this.notaVenta.getMovimientoPantalla( data ) );
                                            }
                                            catch ( error: any ) {
                                                this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message )
                                            }

                                            this.modalService.close( c );
                
                                        } )
                
                                    },
                                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                                })
                
                            } ) );
                
                            mpc.sub.add( mpc.onCancel.subscribe( e => {
                
                                this.movimientoPantallaService.updateItemCancel( 

                                    MovimientoPantalla.initialize([ e.movimientoPantalla ])[0]
                                    .anular() 

                                ).subscribe({
                                    next: data => {
                
                                        this.storeNotaVenta.getRead()
                                        .subscribe( () => {
                
                                            try {
                                                this.openMovimientoPantallaComponent2read( StateComponentMovimientoPantallaComponent.readServer, this.notaVenta.getMovimientoPantalla( data ) );
                                            }
                                            catch ( error: any ) {
                                                this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message )
                                            }
                                            this.modalService.close( c );
                
                                        } )
                
                                    },
                                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                                })
                
                            } ) );

                            mpc.sub.add( mpc.storeMovimientoPantalla.state$.subscribe({
                                complete: () => store.setState( mpc.movimientoPantalla )
                            }) );

                        }
                    },
                    {
                        title: 'Detalles de Pantallas',
                        component: TableComponent<NotaVentaDetalle>,
                        onInit: ( tc: TableComponent<NotaVentaDetalle> ) => {

                            tc.store.setRead( () => this.notaVenta.detalles.filter( detalle => detalle.elementoEconomico instanceof PantallaModeloCalidad ) )
                                    .getRead()
                                    .subscribe();

                            tc.vm$.next({
                                title: 'Detalles de la Transacción',
                                isHeadActive: true,
                                isCloseButtonActive: false,
                                isReadButtonActive: false,
                                stateRow: StateRowTableComponent.select,
                                bindingProperties: this.detallesTableComponentVmBindingProperties,
                                classesCss: '!tw-p-0 !tw-rounded-none !tw-shadow-none !tw-min-h-full'
                            })
                            
                        }
                    },
                ],
            })

            c.sub.add( c.onClose.subscribe( e => {
                this.openMovimientoPantallaComponent2read( StateComponentMovimientoPantallaComponent.readMemory, initialState )
            } ) );

            c.sub.add( c.onDestroy.subscribe( () => store.complete() ) );

        } )
    }



    // Movimientos Producto
    movimientosProductoTableComponentOnInit( c: TableComponent<MovimientoProducto> )
    {
        c.store = this.storeNotaVenta.storeFromThis( state => state.movimientosProducto );

        c.vm$.next({
            title: 'Movimientos de Producto',
            classesCss: '',
            isHeadActive: true,
            isCloseButtonActive: false,
            stateRow: StateRowTableComponent.select,
            bindingProperties: [
                { title: 'Codigo', getValue: item => item.codigo, behavior: PropBehavior.string },
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
                { title: 'Concepto', getValue: item => item.concepto, behavior: PropBehavior.string },
                { title: 'Fecha Emisión', getValue: item => Prop.toDateTime( item.fechaEmision ).isValid ? Prop.toDateTime( item.fechaEmision ).toFormat( 'dd/MM/yyyy HH:mm' ) : '', behavior: PropBehavior.datetime },
                { title: 'Fecha Anulación', getValue: item => Prop.toDateTime( item.fechaAnulacion ).isValid ? Prop.toDateTime( item.fechaAnulacion ).toFormat( 'dd/MM/yyyy HH:mm' ) : '', behavior: PropBehavior.datetime },
                { 
                    title: 'Valor', 
                    getValue: item => Prop.toDecimal( item.importeNeto ).toFixed( 2 ),
                    behavior: PropBehavior.number 
                },
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
            ]
        });


        c.sub.add( this.vm$.subscribe( vm => {

            if ( 
                ( this.vm$.value.stateComponent === StateComponentNotaVentaComponent.create || 
                this.vm$.value.stateComponent === StateComponentNotaVentaComponent.update ) && 
                this.stateDocument === StateDocumentNotaVentaComponent.issued
            ) {
                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Entrada',
                            onClick: e => this.openMovimientoProductoComponent2write( StateComponentMovimientoProductoComponent.createMemory, new EntradaProducto() )
                        },
                        {
                            title: 'Salida',
                            onClick: e => this.openMovimientoProductoComponent2write( StateComponentMovimientoProductoComponent.createMemory, new SalidaProducto() )
                        },
                    ]
                });
            }
            else if (
                this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read && 
                this.stateDocument === StateDocumentNotaVentaComponent.issued
            )
            {
                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Entrada',
                            onClick: e => this.openMovimientoProductoComponent2write( StateComponentMovimientoProductoComponent.createServer, new EntradaProducto() )
                        },
                        {
                            title: 'Salida',
                            onClick: e => this.openMovimientoProductoComponent2write( StateComponentMovimientoProductoComponent.createServer, new SalidaProducto() )
                        },
                    ]
                });
            }
            else {
                c.buttonsMenuComponentVm$.next({
                    buttons: []
                });
            }

        } ) );
    }

    openMovimientoProductoComponent2read( 
        state: StateComponentMovimientoProductoComponent.readMemory |
            StateComponentMovimientoProductoComponent.readServer |
            StateComponentMovimientoProductoComponent.none,
        movimientoProducto: MovimientoProducto
    )
    {
        this.modalService.open( MovimientoProductoComponent ).subscribe( c => {

            c.storeMovimientoProducto.setRead( 
                () => MovimientoProducto.initialize([ movimientoProducto ])[0].set({
                    documentoTransaccion: new NotaVenta({ id: this.notaVenta.id, uuid: this.notaVenta.uuid, symbol: this.notaVenta.symbol, codigoSerie: this.notaVenta.codigoSerie, codigoNumero: this.notaVenta.codigoNumero })
                })
            )
            .getRead()
            .subscribe();

            c.vm$.next({
                title: movimientoProducto instanceof EntradaProducto
                        ? 'Entrada de Producto'
                    : movimientoProducto instanceof SalidaProducto
                        ? 'Salida de Producto'
                        : 'Movimiento de Producto',
                stateComponent: state,
                isStateComponentCustom: 
                    state === StateComponentMovimientoProductoComponent.readMemory
                        ? true
                        : false,
                isHeadActive: true,
                isCloseButtonActive: false,
                isAttached: false,
                classesCss: ''
            });


            if ( state === StateComponentMovimientoProductoComponent.readMemory ) {

                c.buttonsMenuComponentVm$.next({
                    buttons: [
                        {
                            title: 'Actualizar',
                            onClick: e => {
                                c.close( e );
                                this.openMovimientoProductoComponent2write( StateComponentMovimientoProductoComponent.updateMemory, movimientoProducto );
                            }
                        },
                        {
                            title: 'Eliminar',
                            onClick: e => c.delete( e )
                        },
                    ]
                });

            }

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.eliminarMovimientoProducto( e.movimientoProducto ) }) )
                c.close( e.event )
            } ) );


            c.sub.add( c.onCancel.subscribe( e => {

                this.movimientoProductoService.updateItemCancel( MovimientoProducto.initialize([ e.movimientoProducto ])[0].anular() ).subscribe({
                    next: data => {

                        this.storeNotaVenta.getRead()
                        .subscribe( () => {

                            c.storeMovimientoProducto.setRead( () => MovimientoProducto.initialize([ this.notaVenta.getMovimientoProducto( data ) ])[0] )
                            .getRead()
                            .subscribe({
                                next: () => c.vm$.next({ ...c.vm$.value, stateComponent: StateComponentMovimientoProductoComponent.readServer }),
                                error: error => c.close( e.event )
                            });

                        } )

                    },
                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                })

            } ) );

        } );
    }

    openMovimientoProductoComponent2write( 
        state: StateComponentMovimientoProductoComponent.createMemory |
            StateComponentMovimientoProductoComponent.updateMemory |
            StateComponentMovimientoProductoComponent.createServer ,
        movimientoProducto: MovimientoProducto
    )
    {
        this.modalService.open( TabComponent ).subscribe( c => {
        
            const initialState = MovimientoProducto.initialize([ movimientoProducto ])[0].set({
                documentoTransaccion: new NotaVenta({ id: this.notaVenta.id, uuid: this.notaVenta.uuid, symbol: this.notaVenta.symbol, codigoSerie: this.notaVenta.codigoSerie, codigoNumero: this.notaVenta.codigoNumero })
            });

            const store = new ComponentStore(
                MovimientoProducto.initialize([ initialState ])[0],
                () => MovimientoProducto.initialize([ initialState ])[0]
            )

            c.vm$.next({
                title: movimientoProducto instanceof EntradaProducto
                            ? 'Entrada de Producto'
                        : movimientoProducto instanceof SalidaProducto
                            ? 'Salida de Producto'
                            : 'Movimiento de Producto',
                isCloseActive: true,
                classesCss: '!tw-min-h-0 !tw-w-auto tw-rounded tw-p-4 tw-shadow-md',
                tabs: [
                    {
                        title: 'Registro',
                        component: MovimientoProductoComponent,
                        active: true,
                        onInit: ( mpc: MovimientoProductoComponent ) => {

                            mpc.storeMovimientoProducto.setRead( () => MovimientoProducto.initialize([ initialState ])[0] );
                            mpc.storeMovimientoProducto.setState( store.getState() );

                            mpc.vm$.next({
                                title: movimientoProducto instanceof EntradaProducto
                                            ? 'Entrada de Producto'
                                        : movimientoProducto instanceof SalidaProducto
                                            ? 'Salida de Producto'
                                            : 'Movimiento de Producto',
                                stateComponent: state,
                                isStateComponentCustom:
                                    state === StateComponentMovimientoProductoComponent.updateMemory
                                        ? true
                                        : false,
                                isHeadActive: false,
                                isCloseButtonActive: false,
                                isAttached: false,
                                classesCss: '!tw-p-0 !tw-rounded-none !tw-shadow-none !tw-min-h-full',
                            })


                            if ( state === StateComponentMovimientoProductoComponent.updateMemory ) {

                                mpc.buttonsMenu2updateMemory();
                                mpc.buttonsFooterComponentVm$.next({
                                    buttonsHtml: [
                                        {
                                            title: 'Cancelar',
                                            class: BUTTON_CLASS_BOOTSTRAP.light,
                                            onClick: e => {
                                                this.openMovimientoProductoComponent2read( StateComponentMovimientoProductoComponent.readMemory, initialState );
                                                this.modalService.close( c );
                                            }
                                        },
                                        {
                                            title: 'Confirmar',
                                            class: BUTTON_CLASS_BOOTSTRAP.primary,
                                            onClick: e => mpc.update( e )
                                        },
                                    ]
                                });

                            }


                            mpc.sub.add( mpc.onCreate.subscribe( e => {
                                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.agregarMovimientoProducto( e.movimientoProducto ) }) )
                                this.openMovimientoProductoComponent2read( StateComponentMovimientoProductoComponent.readMemory, e.movimientoProducto );
                                this.modalService.close( c );
                            } ) );

                            mpc.sub.add( mpc.onUpdate.subscribe( e => {
                                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.actualizarMovimientoProducto( e.movimientoProducto ) }) )
                                this.openMovimientoProductoComponent2read( StateComponentMovimientoProductoComponent.readMemory, e.movimientoProducto );
                                this.modalService.close( c );
                            } ) );

                            mpc.sub.add( mpc.onDelete.subscribe( e => {
                                this.storeNotaVenta.setState( notaVenta => new NotaVenta({ ...notaVenta.eliminarMovimientoProducto( e.movimientoProducto ) }) )
                                this.modalService.close( c );
                            } ) );

                            mpc.sub.add( mpc.onIssue.subscribe( e => {

                                this.movimientoProductoService.createItem( MovimientoProducto.initialize([ e.movimientoProducto ])[0].emitir() ).subscribe({
                                    next: data => {
                
                                        this.storeNotaVenta.getRead()
                                        .subscribe( () => {

                                            try {
                                                this.openMovimientoProductoComponent2read( StateComponentMovimientoProductoComponent.readServer, this.notaVenta.getMovimientoProducto( data ) );
                                            }
                                            catch ( error: any ) {
                                                this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message )
                                            }

                                            this.modalService.close( c );
                
                                        } )
                
                                    },
                                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                                })
                
                            } ) );
                
                            mpc.sub.add( mpc.onCancel.subscribe( e => {
                
                                this.movimientoProductoService.updateItemCancel( MovimientoProducto.initialize([ e.movimientoProducto ])[0].anular() ).subscribe({
                                    next: data => {
                
                                        this.storeNotaVenta.getRead()
                                        .subscribe( () => {
                
                                            try {
                                                this.openMovimientoProductoComponent2read( StateComponentMovimientoProductoComponent.readServer, this.notaVenta.getMovimientoProducto( data ) );
                                            }
                                            catch ( error: any ) {
                                                this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message )
                                            }
                                            this.modalService.close( c );
                
                                        } )
                
                                    },
                                    error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
                                })
                
                            } ) );

                            mpc.sub.add( mpc.storeMovimientoProducto.state$.subscribe({
                                complete: () => store.setState( mpc.movimientoProducto )
                            }) );

                        }
                    },
                    {
                        title: 'Detalles de Productos',
                        component: TableComponent<NotaVentaDetalle>,
                        onInit: ( tc: TableComponent<NotaVentaDetalle> ) => {

                            tc.store.setRead( () => this.notaVenta.detalles.filter( detalle => detalle.elementoEconomico instanceof Producto ) )
                                    .getRead()
                                    .subscribe();

                            tc.vm$.next({
                                title: 'Detalles de la Transacción',
                                isHeadActive: true,
                                isCloseButtonActive: false,
                                isReadButtonActive: false,
                                stateRow: StateRowTableComponent.select,
                                bindingProperties: this.detallesTableComponentVmBindingProperties,
                                classesCss: '!tw-p-0 !tw-rounded-none !tw-shadow-none !tw-min-h-full'
                            })
                            
                        }
                    },
                ],
            })

            c.sub.add( c.onClose.subscribe( e => {
                this.openMovimientoProductoComponent2read( StateComponentMovimientoProductoComponent.readMemory, initialState )
            } ) );

            c.sub.add( c.onDestroy.subscribe( () => store.complete() ) );

        } )
    }


    buttonsFooter2Create = () => {
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
                    onClick: e => this.issue( e )
                }
            ]
        });
    };

    buttonsFooter2update = () => {

        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Cancelar',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => {
                        this.storeNotaVenta.getRead().subscribe( () => {
                            
                            this.vm$.next({
                                ...this.vm$.value,
                                stateComponent: StateComponentNotaVentaComponent.read
                            });

                            this.onCancelUpdate.emit({
                                event: e,
                                sender: this,
                                notaVenta: this.notaVenta
                            });
                            
                        } );
                    }
                },
                {
                    title: 'Confirmar',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.onUpdate.emit({
                        event: e,
                        sender: this,
                        notaVenta: this.notaVenta
                    })
                }
            ]
        });
    }

    buttonsFooter2readDraft = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Eliminar',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => this.delete( e )
                },
                {
                    title: 'Actualizar',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.vm$.next({
                        ...this.vm$.value,
                        stateComponent: StateComponentNotaVentaComponent.update
                    })
                },
                {
                    title: 'Emitir',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.issue( e )
                }
            ]
        });
    };

    buttonsFooter2readIssued = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Eliminar',
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    onClick: e => this.delete( e )
                },
                {
                    title: 'Anular',
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    onClick: e => this.cancel( e )
                }
            ]
        });
    };

    buttonsFooter2readCanceled = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Eliminar',
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    onClick: e => this.delete( e )
                },
            ]
        });
    }



    constructor()
    {
        NotaVentaComponent.id++;
        this.instanceId = NotaVentaComponent.id;
    }


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.storeNotas = this.storeNotaVenta.storeFromThis( notaVenta => [...notaVenta.notas] )
        this.storeImportes = this.storeNotaVenta.storeFromThis<NotaVentaComponentImporte[]>( notaVenta => [
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
        

        this.sub.add( this.storeNotaVenta.state$.subscribe( state => {
            
            this.notaVenta = state;

            console.log( this.notaVenta );

            this.stateDocument = this.notaVenta.fechaAnulacion
                                    ? StateDocumentNotaVentaComponent.canceled
                                : this.notaVenta.fechaEmision
                                    ? StateDocumentNotaVentaComponent.issued
                                : this.notaVenta.fechaCreacion
                                    ? StateDocumentNotaVentaComponent.draft
                                    : StateDocumentNotaVentaComponent.draft;

            this.vm$.next({...this.vm$.value});

        } ) );

        this.sub.add( this.vm$.subscribe( vm => {

            this.hostClasses = vm.classesCss ?? '';

            if ( vm.stateComponent === StateComponentNotaVentaComponent.create ) {
                this.buttonsFooter2Create();
            }
            else if ( vm.stateComponent === StateComponentNotaVentaComponent.update ) {
                this.buttonsFooter2update();
            }
            else if ( vm.stateComponent === StateComponentNotaVentaComponent.read ) {

                if ( this.stateDocument === StateDocumentNotaVentaComponent.draft ) {
                    this.buttonsFooter2readDraft();
                }
                else if ( this.stateDocument === StateDocumentNotaVentaComponent.issued ) {
                    this.buttonsFooter2readIssued();
                }
                else if ( this.stateDocument === StateDocumentNotaVentaComponent.canceled ) {
                    this.buttonsFooter2readCanceled();
                }
            }

        } ) );

        this.sub.add( this.storeNotaVenta.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );

        this.sub.add( this.buttonsFooterComponentVm$.subscribe( vm => this.buttonsFooterLength = vm.buttonsHtml.length ) )

    }


    toggleCliente( e: Event, inputClienteGenerico: HTMLInputElement )
    {
        if ( e.target !== inputClienteGenerico ) inputClienteGenerico.checked = !inputClienteGenerico.checked;

        if ( inputClienteGenerico.checked ) {
            this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                ...notaVenta,
                cliente: undefined
            }) );
        }
    }


    // Cliente
    selectCliente()
    {
        this.clienteService.openTableComponent2selectItem().subscribe( c => {

            c.sub.add( c.store.state$.subscribe( state => 
                this.notaVenta.cliente 
                ? c.setDataChecked( [this.notaVenta.cliente] ) 
                : undefined ) 
            )

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta,
                    cliente: e.item
                }) )
            } ) );

            c.sub.add( c.onResetItem.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta,
                    cliente: e.item
                }) )
            } ) );

        } )
    }


    // Receptor DOC ID
    selectReceptorDocumentoIdentificacion()
    {
        this.documentoIdentificacionService.openTableComponent2selectItem().subscribe( c => {

            c.sub.add( c.store.state$.subscribe( state => 
                this.notaVenta.receptorDocumentoIdentificacion
                ? c.setDataChecked( [this.notaVenta.receptorDocumentoIdentificacion] )
                : undefined
            ) );

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta,
                    receptorDocumentoIdentificacion: e.item
                }) )
            } ) )

            c.sub.add( c.onResetItem.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta({
                    ...notaVenta,
                    receptorDocumentoIdentificacion: e.item
                }) )
            } ) );

        } )
    }


    // Liquidacion
    selectLiquidacionTipo( id: 1 | 2 )
    {
        this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.setLiquidacionTipo( id ) ) );
    }


    // Anticipo
    openAnticipoComponent( state: StateObjectComponent, importe: NotaVentaComponentImporte )
    {
        if ( importe !== this.storeImportes.getState()[ 2 ] ) return;

        this.modalService.open( ObjectComponent<NotaVentaComponentImporte> ).subscribe( c => {

            c.store.setRead( () => ({ ...this.storeImportes.getState()[2] }) )
                    .getRead()
                    .subscribe();

            c.vm$.next({
                title: 'Anticipo',
                classesCss: '',
                isCloseButtonActive: true,
                isReadButtonActive: false,
                state: this.vm$.value.stateComponent === StateComponentNotaVentaComponent.read || this.vm$.value.stateComponent === StateComponentNotaVentaComponent.none
                        ? StateObjectComponent.none
                        : state,
                bindingProperties: [
                    { title: 'Anticipo', getValue: item => item.amount, setValue: ( item, value ) => item.amount = value, behavior: PropBehavior.number }
                ]
            });


            c.sub.add( c.onCreate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( 
                    notaVenta.set({ importeAnticipo: e.item.amount }).procesarInformacion()
                ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onUpdate.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( 
                    notaVenta.set({ importeAnticipo: e.item.amount }).procesarInformacion()
                ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeNotaVenta.setState( notaVenta => new NotaVenta( 
                    notaVenta.set({ importeAnticipo: 0 }).procesarInformacion()
                ) );
                c.close( e.event );
            } ) );

            c.sub.add( c.onCancelUpdate.subscribe( e => c.close( e.event ) ) );

        } )
    }


    procesarInformacion( e: Event )
    {
        this.storeNotaVenta.setState( notaVenta => new NotaVenta( notaVenta.procesarInformacion() ) )
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


    delete( e: Event )
    {
        this.modalService.open( MessageBoxComponent ).subscribe( c => {

            c.mensaje = "¿Estás seguro que deseas eliminar el registro?";
            c.dataBindingButtons = [
                {
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    title: 'Cancelar',
                    onClick: e => this.modalService.close( c )
                },
                {
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    title: 'Confirmar',
                    onClick: e => {
                        this.modalService.close( c );
                        this.onDelete.emit({
                            event: e,
                            sender: this,
                            notaVenta: this.notaVenta
                        });
                    }
                },
            ];

        } )
    }


    issue( e: Event )
    {
        this.modalService.open( MessageBoxComponent ).subscribe( c => {

            c.mensaje = "El documento será emitido.";
            c.dataBindingButtons = [
                {
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    title: 'Cancelar',
                    onClick: e => this.modalService.close( c )
                },
                {
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    title: 'Confirmar',
                    onClick: e => {
                        this.modalService.close( c );
                        this.onIssue.emit({
                            event: e,
                            sender: this,
                            notaVenta: this.notaVenta
                        });
                    }
                },
            ];

        } )
    }


    cancel( e: Event )
    {
        this.modalService.open( MessageBoxComponent ).subscribe( c => {

            c.mensaje = "El documento será anulado.";
            c.dataBindingButtons = [
                {
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    title: 'Cancelar',
                    onClick: e => this.modalService.close( c )
                },
                {
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    title: 'Confirmar',
                    onClick: e => {
                        this.modalService.close( c );
                        this.onCancel.emit({
                            event: e,
                            sender: this,
                            notaVenta: this.notaVenta
                        });
                    }
                },
            ];

        } )
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeNotaVenta.complete();
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
    draft,
    issued,
    canceled
}


export enum StateComponentNotaVentaComponent
{
    create,
    update,
    read,
    none
}


export type NotaVentaComponentImporte = ItemType &
{
    title: string,
    amount: number
}

export interface NotaVentaComponentVm
{
    classesCss?: string,
    stateComponent: StateComponentNotaVentaComponent;
    isCloseButtonActive: boolean;
}