import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { EntradaProducto, EntradaProductoDetalle, MovimientoProducto, MovimientoProductoDetalle, Prop, PropBehavior, SalidaProducto, SalidaProductoDetalle } from '@app/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ButtonsMenuComponent, ButtonsMenuComponentVm } from '../../../Components/ButtonsMenu/ButtonsMenu.component';
import { ButtonsFooterComponent, ButtonsFooterComponentVm } from '../../../Components/ButtonsFooter/ButtonsFooter.component';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { ProductoService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/Producto/producto.service';
import { DocumentoTransaccionService } from 'apps/client/src/app/models/DocumentosTransaccion/documento-transaccion.service';
import { ObjectComponent, StateObjectComponent } from '../../Object/Object.component';
import { BUTTON_CLASS_BOOTSTRAP } from 'apps/client/src/app/utils/ButtonsClass';
import { StateRowTableComponent, TableComponent } from '../../../CollectionComponents/Table/Table.component';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movimiento-producto',
  imports: [
    CommonModule,
    AsyncPipe,
    ButtonsMenuComponent,
    TableComponent,
    FormsModule,
    ButtonsFooterComponent
],
  templateUrl: './MovimientoProducto.component.html',
  styleUrl: './MovimientoProducto.component.css',
})
export class MovimientoProductoComponent implements IComponent<MovimientoProductoComponent> {
    
    @Input() storeMovimientoProducto = new ComponentStore<MovimientoProducto>( new MovimientoProducto(), () => new MovimientoProducto() );
    movimientoProducto = new MovimientoProducto();

    @HostBinding( 'class' ) hostClasses: string = '';

    @Input() vm$ = new BehaviorSubject<MovimientoProductoComponentVm>({
        title: 'Movimiento Producto',
        stateComponent: StateComponentMovimientoProductoComponent.readMemory,
        isHeadActive: true,
        isCloseButtonActive: true,
        isAttached: true
    });

    @Input() buttonsMenuComponentVm$ = new BehaviorSubject<ButtonsMenuComponentVm>({
        buttons: []
    });

    @Input() buttonsFooterComponentVm$ = new BehaviorSubject<ButtonsFooterComponentVm>({
        buttonsHtml: []
    });


    @Output() readonly onInit = new EventEmitter<MovimientoProductoComponent>();
    @Output() readonly onDestroy = new EventEmitter<MovimientoProductoComponent>();
    @Output() readonly onClose = new EventEmitter<MovimientoProductoComponentEventData>();

    @Output() readonly onCreate = new EventEmitter<MovimientoProductoComponentEventData>();
    @Output() readonly onUpdate = new EventEmitter<MovimientoProductoComponentEventData>();
    @Output() readonly onDelete = new EventEmitter<MovimientoProductoComponentEventData>();

    @Output() readonly onIssue = new EventEmitter<MovimientoProductoComponentEventData>();
    @Output() readonly onCancel = new EventEmitter<MovimientoProductoComponentEventData>();

    sub: Subscription = new Subscription();
    modalService = inject( ModalService );
    productoService = inject( ProductoService );
    documentoTransaccionService = inject( DocumentoTransaccionService );
    stateDocument = StateDocumentMovimientoProductoComponent.draft;
    StateComponentMovimientoProductoComponent = StateComponentMovimientoProductoComponent;
    StateObjectComponent = StateObjectComponent;
    Prop = Prop;

    
    // MEMORY

    // CREATE
    buttonsFooter2createMemory = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Crear',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.create( e )
                }
            ]
        });
    };

    // READ
    buttonsMenu2readMemory = () => {
        this.buttonsMenuComponentVm$.next({
            buttons: [
                {
                    title: 'Actualizar',
                    onClick: e => this.vm$.next({
                        ...this.vm$.value,
                        stateComponent: StateComponentMovimientoProductoComponent.updateMemory
                    })
                },
                {
                    title: 'Eliminar',
                    onClick: e => this.delete( e )
                }
            ]
        });
    };

    // UPDATE
    buttonsMenu2updateMemory = () => {
        this.buttonsMenuComponentVm$.next({
            buttons: [
                {
                    title: 'Eliminar',
                    onClick: e => this.delete( e )
                }
            ]
        });
    };
    buttonsFooter2updateMemory = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Cancelar',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => {
                        this.storeMovimientoProducto.getRead().subscribe( () => {
                            this.vm$.next({
                                ...this.vm$.value,
                                stateComponent: StateComponentMovimientoProductoComponent.readMemory
                            });
                        } )
                    }
                },
                {
                    title: 'Guardar',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.update( e )
                }
            ]
        });
    };



    // SERVER

    // CREATE
    buttonsFooter2createServer = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Emitir',
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    onClick: e => this.issue( e )
                },
                {
                    title: 'Eliminar',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => this.delete( e )
                }
            ]
        });
    };

    // READ
    buttonsFooter2readServerIssue = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Anular',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => this.cancel( e )
                },
                {
                    title: 'Eliminar',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => this.delete( e )
                }
            ]
        });
    };


    // NONE
    buttonsMenu2none = () => {
        this.buttonsMenuComponentVm$.next({
            buttons: []
        });
    };
    buttonsFooter2none = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: []
        });
    };



    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storeMovimientoProducto.state$.subscribe( item => {

            this.movimientoProducto = item;
            console.log( this.movimientoProducto )
            
            this.stateDocument = this.movimientoProducto.fechaAnulacion
                                    ? StateDocumentMovimientoProductoComponent.canceled
                                : this.movimientoProducto.fechaEmision
                                    ? StateDocumentMovimientoProductoComponent.issued
                                    : StateDocumentMovimientoProductoComponent.draft;

            this.vm$.next({...this.vm$.value});

        } ) );

        this.sub.add( this.vm$.subscribe( vm => {

            this.hostClasses = vm.classesCss ?? '';

            if ( !vm.isStateComponentCustom ) {
                
                if ( vm.stateComponent === StateComponentMovimientoProductoComponent.createMemory ) {
    
                    this.buttonsMenu2none();
                    this.buttonsFooter2createMemory();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoProductoComponent.updateMemory ) {
                    
                    this.buttonsMenu2updateMemory();
                    this.buttonsFooter2updateMemory();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoProductoComponent.readMemory ) {
                    
                    this.buttonsMenu2readMemory();
                    this.buttonsFooter2none();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoProductoComponent.createServer ) {
    
                    this.buttonsMenu2none();
                    this.buttonsFooter2createServer();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoProductoComponent.readServer ) {
                    
                    if ( this.stateDocument === StateDocumentMovimientoProductoComponent.issued ) {
                        this.buttonsMenu2none();
                        this.buttonsFooter2readServerIssue();
                    }
                    else {
                        this.buttonsMenu2none();
                        this.buttonsFooter2none();
                    }
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoProductoComponent.none ) {
                    
                    this.buttonsMenu2none();
                    this.buttonsFooter2none();
    
                }

            }

        } ) );
    }


    selectDocumentoTransaccion( e: Event )
    {
        this.documentoTransaccionService.openTableComponent2selectIssued().subscribe( c => {

            c.sub.add( c.store.state$.subscribe( () => 
                this.movimientoProducto.documentoTransaccion
                    ? c.setDataChecked([ this.movimientoProducto.documentoTransaccion ])
                    : undefined
            ) )

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeMovimientoProducto.setState( movimientoProducto => MovimientoProducto.initialize([{
                    ...movimientoProducto,
                    documentoTransaccion: e.item
                }])[0] )
            } ) );

            c.sub.add( c.onResetItem.subscribe( e => {
                this.storeMovimientoProducto.setState( movimientoProducto => MovimientoProducto.initialize([{
                    ...movimientoProducto,
                    documentoTransaccion: e.item
                }])[0] )
            } ) )

        } )
    }


    // Detalles
    detallesTableComponentOnInit( c: TableComponent<MovimientoProductoDetalle> )
    {
        c.store = this.storeMovimientoProducto.storeFromThis( state => state.detalles );
        
        c.vm$.next({
            title: 'Detalles',
            isHeadActive: true,
            isCloseButtonActive: false,
            stateRow: StateRowTableComponent.select,
            bindingProperties: [
                { 
                    title: 'Código', 
                    getValue: item => item.producto?.codigo,
                    behavior: PropBehavior.string 
                },
                { 
                    title: 'Producto', 
                    getValue: item => `${item.producto?.nombre ?? ''} ${item.producto?.magnitud?.nombre ?? ''}`.trim(),
                    behavior: PropBehavior.string 
                },
                { 
                    title: 'Cantidad', 
                    getValue: item => Prop.toDecimal( item.cantidad ).toFixed( 0 ),
                    behavior: PropBehavior.number 
                },
                { 
                    title: this.movimientoProducto instanceof EntradaProducto
                                ? 'Costo Uni.'
                            : this.movimientoProducto instanceof SalidaProducto
                                ? 'Precio Uni.'
                                : 'Importe Uni.',
                    getValue: item => Prop.toDecimal( item.importeUnitario ).toFixed( 2 ),
                    behavior: PropBehavior.number
                },
                { 
                    title: this.movimientoProducto instanceof EntradaProducto
                                ? 'Costo Total'
                            : this.movimientoProducto instanceof SalidaProducto
                                ? 'Precio Total'
                                : 'Importe Total',
                    getValue: item => Prop.toDecimal( item.importeNeto ).toFixed( 2 ),
                    behavior: PropBehavior.number
                },
            ]
        });

        if ( 
            this.vm$.value.stateComponent === StateComponentMovimientoProductoComponent.createMemory ||
            this.vm$.value.stateComponent === StateComponentMovimientoProductoComponent.updateMemory ||
            this.vm$.value.stateComponent === StateComponentMovimientoProductoComponent.createServer
        ) {

            const onAddEntrada = new EventEmitter();
            const onAddSalida = new EventEmitter();
    
            c.buttonsMenuComponentVm$.next({
                buttons: [
                    {
                        title: 'Agregar Detalle',
                        onClick: e => {
                            if ( this.movimientoProducto instanceof EntradaProducto ) {
                                onAddEntrada.emit()
                            }
                            else if ( this.movimientoProducto instanceof SalidaProducto ) {
                                onAddSalida.emit()
                            }
                        }
                    }
                ]
            });
    
            c.sub.add( onAddEntrada.subscribe( () => this.openDetalleComponent( StateObjectComponent.create, new EntradaProductoDetalle() ) ) );
    
            c.sub.add( onAddSalida.subscribe( () => this.openDetalleComponent( StateObjectComponent.create, new SalidaProductoDetalle() ) ) );

        }
    }

    openDetalleComponent( state: StateObjectComponent, detalle: MovimientoProductoDetalle )
    {
        this.modalService.open( ObjectComponent<MovimientoProductoDetalle> ).subscribe( c => {

            c.store.setRead( () => MovimientoProductoDetalle.initialize([ detalle ])[0] )
                    .getRead()
                    .subscribe();


            c.vm$.next({
                title: 'Detalle',
                classesCss: '',
                isCloseButtonActive: true,
                isReadButtonActive: false,
                state: this.vm$.value.stateComponent === StateComponentMovimientoProductoComponent.readMemory ||
                        this.vm$.value.stateComponent === StateComponentMovimientoProductoComponent.readServer ||
                        this.vm$.value.stateComponent === StateComponentMovimientoProductoComponent.none
                            ? StateObjectComponent.none
                            : state,
                bindingProperties: [
                    { 
                        title: 'Código', 
                        getValue: item => item.producto?.codigo ?? '-',
                        behavior: PropBehavior.string 
                    },
                    {
                        title: 'Producto',
                        getValue: item => `${item.producto?.nombre ?? ''} ${item.producto?.magnitud?.nombre ?? ''}`.trim(),
                        setValue: ( item, value ) => item.set({ producto: value }),
                        behavior: PropBehavior.model,
                        required: true,
                        onClick: item => {
                            this.productoService.openTableComponent2selectItem().subscribe( tc => {
    
                                tc.sub.add( tc.store.state$.subscribe( () =>
                                    item.producto
                                        ? tc.setDataChecked([ item.producto ])
                                        : undefined
                                ) );
    
                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( 
                                        detalle => MovimientoProductoDetalle.initialize([{
                                            ...detalle,
                                            producto: e.item,
                                        }])[0]
                                        .calcularImportes()
                                    )
                                } ) );
    
                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( 
                                        detalle => MovimientoProductoDetalle.initialize([{
                                            ...detalle,
                                            producto: e.item
                                        }])[0]
                                        .calcularImportes()
                                    )
                                } ) );
    
                            } )
                        }
                    },
                    { 
                        title: 'Cantidad',
                        getValue: ( item, original ) => 
                            original
                                ? item.cantidad
                                : Prop.toDecimal( item.cantidad ).toFixed( 0 ), 
                        setValue: ( item, value ) => item.set({ cantidad: value }).calcularImportes(), 
                        required: true,
                        behavior: PropBehavior.number 
                    },
                    {
                        title: c.store.getState() instanceof EntradaProductoDetalle
                                    ? 'Costo Uni.'
                                : c.store.getState() instanceof SalidaProductoDetalle
                                    ? 'Precio Uni.'
                                    : 'Importe Unitario',
                        getValue: ( item, original ) => 
                            original
                                ? item.importeUnitario
                                : Prop.toDecimal( item.importeUnitario ).toFixed( 2 ),
                        setValue: ( item, value ) => item.set({ importeUnitario: value }).calcularImportes(), 
                        required: true,
                        behavior: PropBehavior.number 
                    },
                ]
            });

            c.sub.add( c.onCreate.subscribe( e => {
                this.storeMovimientoProducto.setState( movimientoProducto => MovimientoProducto.initialize([ {...movimientoProducto.agregarDetalle( e.item )} ])[0] );
                c.close( e.event );
            } ) );

            c.sub.add( c.onUpdate.subscribe( e => {
                this.storeMovimientoProducto.setState( movimientoProducto => MovimientoProducto.initialize([ {...movimientoProducto.actualizarDetalle( e.item )} ])[0] );
                c.close( e.event );
            } ) );

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeMovimientoProducto.setState( movimientoProducto => MovimientoProducto.initialize([ {...movimientoProducto.eliminarDetalle( e.item )} ])[0] );
                c.close( e.event );
            } ) );

            c.sub.add( c.onCancelUpdate.subscribe( e => c.close( e.event ) ) );

        } )
    }

    
    close( e: Event )
    {
        this.onClose.emit({
            event: e,
            sender: this,
            movimientoProducto: this.movimientoProducto
        });
        this.modalService.close( this );
    }


    create( e: Event )
    {
        this.onCreate.emit({
            event: e,
            sender: this,
            movimientoProducto: this.movimientoProducto
        });
        this.close( e )
    }


    update( e: Event )
    {
        this.modalService.open( MessageBoxComponent ).subscribe( c => {

            c.mensaje = "Se actualizará el registro.";
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
                        this.onUpdate.emit({
                            event: e,
                            sender: this,
                            movimientoProducto: this.movimientoProducto
                        });
                        this.close( e );
                    }
                },
            ];

        } )
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
                            movimientoProducto: this.movimientoProducto
                        });
                        this.close( e );
                    }
                },
            ];

        } )
    }


    issue( e: Event )
    {
        this.modalService.open( MessageBoxComponent ).subscribe( c => {

            c.mensaje = "El documento será emitido";
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
                            movimientoProducto: this.movimientoProducto
                        });
                    }
                },
            ];

        } )
    }


    cancel( e: Event )
    {
        this.modalService.open( MessageBoxComponent ).subscribe( c => {

            c.mensaje = "¿Estás seguro que deseas anular el documento?";
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
                            movimientoProducto: this.movimientoProducto
                        });
                    }
                },
            ];

        } )
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeMovimientoProducto.complete();
    }
}


export type MovimientoProductoComponentEventData =
{
    event: Event,
    sender: MovimientoProductoComponent,
    movimientoProducto: MovimientoProducto
}


export enum StateComponentMovimientoProductoComponent
{
    createMemory,
    updateMemory,
    readMemory,
    createServer,
    readServer,
    none
}


export enum StateDocumentMovimientoProductoComponent
{
    draft,
    issued,
    canceled
}


export interface MovimientoProductoComponentVm
{
    title: string,
    classesCss?: string,
    stateComponent: StateComponentMovimientoProductoComponent,
    isStateComponentCustom?: boolean,
    isHeadActive: boolean,
    isCloseButtonActive: boolean,
    isAttached: boolean
}