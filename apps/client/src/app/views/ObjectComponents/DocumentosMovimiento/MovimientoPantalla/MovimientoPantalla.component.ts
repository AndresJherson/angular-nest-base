import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EntradaPantalla, EntradaPantallaDetalle, MovimientoPantalla, MovimientoPantallaDetalle, PantallaModeloCalidad, Prop, PropBehavior, SalidaPantalla, SalidaPantallaDetalle } from '@app/models';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { ButtonsMenuComponentVm, ButtonsMenuComponent } from '../../../Components/ButtonsMenu/ButtonsMenu.component';
import { ButtonsFooterComponentVm, ButtonsFooterComponent } from '../../../Components/ButtonsFooter/ButtonsFooter.component';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { BUTTON_CLASS_BOOTSTRAP } from 'apps/client/src/app/utils/ButtonsClass';
import { ObjectComponent, StateObjectComponent } from '../../Object/Object.component';
import { PantallaModeloCalidadService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo-calidad.service';
import { DocumentoTransaccionService } from 'apps/client/src/app/models/DocumentosTransaccion/documento-transaccion.service';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { StateRowTableComponent, TableComponent } from "../../../CollectionComponents/Table/Table.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movimiento-pantalla',
  imports: [
    CommonModule,
    AsyncPipe,
    ButtonsMenuComponent,
    TableComponent,
    FormsModule,
    ButtonsFooterComponent
],
  templateUrl: './MovimientoPantalla.component.html',
  styleUrl: './MovimientoPantalla.component.css',
})
export class MovimientoPantallaComponent implements IComponent<MovimientoPantallaComponent> {
    
    @Input() storeMovimientoPantalla = new ComponentStore<MovimientoPantalla>( new MovimientoPantalla(), () => new MovimientoPantalla() );
    movimientoPantalla = new MovimientoPantalla();

    @HostBinding( 'class' ) hostClasses: string = '';

    @Input() vm$ = new BehaviorSubject<MovimientoPantallaComponentVm>({
        title: 'Movimiento Pantalla',
        stateComponent: StateComponentMovimientoPantallaComponent.readMemory,
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


    @Output() readonly onInit = new EventEmitter<MovimientoPantallaComponent>();
    @Output() readonly onDestroy = new EventEmitter<MovimientoPantallaComponent>();
    @Output() readonly onClose = new EventEmitter<MovimientoPantallaComponentEventData>();

    @Output() readonly onCreate = new EventEmitter<MovimientoPantallaComponentEventData>();
    @Output() readonly onUpdate = new EventEmitter<MovimientoPantallaComponentEventData>();
    @Output() readonly onDelete = new EventEmitter<MovimientoPantallaComponentEventData>();

    @Output() readonly onIssue = new EventEmitter<MovimientoPantallaComponentEventData>();
    @Output() readonly onCancel = new EventEmitter<MovimientoPantallaComponentEventData>();

    sub: Subscription = new Subscription();
    modalService = inject( ModalService );
    pantallaModeloCalidadService = inject( PantallaModeloCalidadService );
    documentoTransaccionService = inject( DocumentoTransaccionService );
    stateDocument = StateDocumentMovimientoPantallaComponent.draft;
    StateComponentMovimientoPantallaComponent = StateComponentMovimientoPantallaComponent;
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
                        stateComponent: StateComponentMovimientoPantallaComponent.updateMemory
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
                        this.storeMovimientoPantalla.getRead().subscribe( () => {
                            this.vm$.next({
                                ...this.vm$.value,
                                stateComponent: StateComponentMovimientoPantallaComponent.readMemory
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

        this.sub.add( this.storeMovimientoPantalla.state$.subscribe( item => {

            this.movimientoPantalla = item;
            console.log( this.movimientoPantalla )
            
            this.stateDocument = this.movimientoPantalla.fechaAnulacion
                                    ? StateDocumentMovimientoPantallaComponent.canceled
                                : this.movimientoPantalla.fechaEmision
                                    ? StateDocumentMovimientoPantallaComponent.issued
                                    : StateDocumentMovimientoPantallaComponent.draft;

            this.vm$.next({...this.vm$.value});

        } ) );

        this.sub.add( this.vm$.subscribe( vm => {

            this.hostClasses = vm.classesCss ?? '';

            if ( !vm.isStateComponentCustom ) {
                
                if ( vm.stateComponent === StateComponentMovimientoPantallaComponent.createMemory ) {
    
                    this.buttonsMenu2none();
                    this.buttonsFooter2createMemory();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoPantallaComponent.updateMemory ) {
                    
                    this.buttonsMenu2updateMemory();
                    this.buttonsFooter2updateMemory();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoPantallaComponent.readMemory ) {
                    
                    this.buttonsMenu2readMemory();
                    this.buttonsFooter2none();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoPantallaComponent.createServer ) {
    
                    this.buttonsMenu2none();
                    this.buttonsFooter2createServer();
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoPantallaComponent.readServer ) {
                    
                    if ( this.stateDocument === StateDocumentMovimientoPantallaComponent.issued ) {
                        this.buttonsMenu2none();
                        this.buttonsFooter2readServerIssue();
                    }
                    else {
                        this.buttonsMenu2none();
                        this.buttonsFooter2none();
                    }
    
                }
                else if ( vm.stateComponent === StateComponentMovimientoPantallaComponent.none ) {
                    
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
                this.movimientoPantalla.documentoTransaccion
                    ? c.setDataChecked([ this.movimientoPantalla.documentoTransaccion ])
                    : undefined
            ) )

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeMovimientoPantalla.setState( movimientoPantalla => MovimientoPantalla.initialize([{
                    ...movimientoPantalla,
                    documentoTransaccion: e.item
                }])[0] )
            } ) );

            c.sub.add( c.onResetItem.subscribe( e => {
                this.storeMovimientoPantalla.setState( movimientoPantalla => MovimientoPantalla.initialize([{
                    ...movimientoPantalla,
                    documentoTransaccion: e.item
                }])[0] )
            } ) )

        } )
    }


    // Detalles
    detallesTableComponentOnInit( c: TableComponent<MovimientoPantallaDetalle> )
    {
        c.store = this.storeMovimientoPantalla.storeFromThis( state => state.detalles );
        
        c.vm$.next({
            title: 'Detalles',
            isHeadActive: true,
            isCloseButtonActive: false,
            stateRow: StateRowTableComponent.select,
            bindingProperties: [
                { 
                    title: 'Código', 
                    getValue: item => item.pantallaModeloCalidad?.codigo,
                    behavior: PropBehavior.string 
                },
                { 
                    title: 'Pantalla', 
                    getValue: item => `${item.pantallaModeloCalidad?.pantallaModelo?.nombre ?? ''} ${item.pantallaModeloCalidad?.pantallaModelo?.pantallaMarca?.nombre ?? ''} ${item.pantallaModeloCalidad?.calidad?.nombre ?? ''}`.trim(),
                    behavior: PropBehavior.string 
                },
                { 
                    title: 'Cantidad', 
                    getValue: item => Prop.toDecimal( item.cantidad ).toFixed( 0 ),
                    behavior: PropBehavior.number 
                },
                { 
                    title: this.movimientoPantalla instanceof EntradaPantalla
                                ? 'Costo Uni.'
                            : this.movimientoPantalla instanceof SalidaPantalla
                                ? 'Precio Uni.'
                                : 'Importe Uni.',
                    getValue: item => Prop.toDecimal( item.importeUnitario ).toFixed( 2 ),
                    behavior: PropBehavior.number
                },
                { 
                    title: this.movimientoPantalla instanceof EntradaPantalla
                                ? 'Costo Total'
                            : this.movimientoPantalla instanceof SalidaPantalla
                                ? 'Precio Total'
                                : 'Importe Total',
                    getValue: item => Prop.toDecimal( item.importeNeto ).toFixed( 2 ),
                    behavior: PropBehavior.number
                },
            ]
        });

        if ( 
            this.vm$.value.stateComponent === StateComponentMovimientoPantallaComponent.createMemory ||
            this.vm$.value.stateComponent === StateComponentMovimientoPantallaComponent.updateMemory ||
            this.vm$.value.stateComponent === StateComponentMovimientoPantallaComponent.createServer
        ) {

            const onAddEntrada = new EventEmitter();
            const onAddSalida = new EventEmitter();
    
            c.buttonsMenuComponentVm$.next({
                buttons: [
                    {
                        title: 'Agregar Detalle',
                        onClick: e => {
                            if ( this.movimientoPantalla instanceof EntradaPantalla ) {
                                onAddEntrada.emit()
                            }
                            else if ( this.movimientoPantalla instanceof SalidaPantalla ) {
                                onAddSalida.emit()
                            }
                        }
                    }
                ]
            });
    
            c.sub.add( onAddEntrada.subscribe( () => this.openDetalleComponent( StateObjectComponent.create, new EntradaPantallaDetalle() ) ) );
    
            c.sub.add( onAddSalida.subscribe( () => this.openDetalleComponent( StateObjectComponent.create, new SalidaPantallaDetalle() ) ) );

        }
    }

    openDetalleComponent( state: StateObjectComponent, detalle: MovimientoPantallaDetalle )
    {
        this.modalService.open( ObjectComponent<MovimientoPantallaDetalle> ).subscribe( c => {

            c.store.setRead( () => MovimientoPantallaDetalle.initialize([ detalle ])[0] )
                    .getRead()
                    .subscribe();


            c.vm$.next({
                title: 'Detalle',
                classesCss: '',
                isCloseButtonActive: true,
                isReadButtonActive: false,
                state: this.vm$.value.stateComponent === StateComponentMovimientoPantallaComponent.readMemory ||
                        this.vm$.value.stateComponent === StateComponentMovimientoPantallaComponent.readServer ||
                        this.vm$.value.stateComponent === StateComponentMovimientoPantallaComponent.none
                            ? StateObjectComponent.none
                            : state,
                bindingProperties: [
                    { 
                        title: 'Código', 
                        getValue: item => item.pantallaModeloCalidad?.codigo ?? '-',
                        behavior: PropBehavior.string 
                    },
                    {
                        title: 'Pantalla',
                        getValue: item => `${item.pantallaModeloCalidad?.pantallaModelo?.nombre ?? ''} ${item.pantallaModeloCalidad?.pantallaModelo?.pantallaMarca?.nombre ?? ''} ${item.pantallaModeloCalidad?.calidad?.nombre ?? ''}`.trim(),
                        setValue: ( item, value ) => item.set({ pantallaModeloCalidad: value }),
                        behavior: PropBehavior.model,
                        required: true,
                        onClick: item => {
                            this.pantallaModeloCalidadService.openTableComponent2selectItem().subscribe( tc => {
    
                                tc.sub.add( tc.store.state$.subscribe( () =>
                                    item.pantallaModeloCalidad
                                        ? tc.setDataChecked([ item.pantallaModeloCalidad ])
                                        : undefined
                                ) );
    
                                tc.sub.add( tc.onSelectItem.subscribe( e => {
                                    c.store.setState( 
                                        detalle => MovimientoPantallaDetalle.initialize([{
                                            ...detalle,
                                            pantallaModeloCalidad: e.item,
                                        }])[0]
                                        .calcularImportes()
                                    )
                                } ) );
    
                                tc.sub.add( tc.onResetItem.subscribe( e => {
                                    c.store.setState( 
                                        detalle => MovimientoPantallaDetalle.initialize([{
                                            ...detalle,
                                            pantallaModeloCalidad: e.item
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
                        title: c.store.getState() instanceof EntradaPantallaDetalle
                                    ? 'Costo Uni.'
                                : c.store.getState() instanceof SalidaPantallaDetalle
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
                this.storeMovimientoPantalla.setState( movimientoPantalla => MovimientoPantalla.initialize([ {...movimientoPantalla.agregarDetalle( e.item )} ])[0] );
                c.close( e.event );
            } ) );

            c.sub.add( c.onUpdate.subscribe( e => {
                this.storeMovimientoPantalla.setState( movimientoPantalla => MovimientoPantalla.initialize([ {...movimientoPantalla.actualizarDetalle( e.item )} ])[0] );
                c.close( e.event );
            } ) );

            c.sub.add( c.onDelete.subscribe( e => {
                this.storeMovimientoPantalla.setState( movimientoPantalla => MovimientoPantalla.initialize([ {...movimientoPantalla.eliminarDetalle( e.item )} ])[0] );
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
            movimientoPantalla: this.movimientoPantalla
        });
        this.modalService.close( this );
    }


    create( e: Event )
    {
        this.onCreate.emit({
            event: e,
            sender: this,
            movimientoPantalla: this.movimientoPantalla
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
                            movimientoPantalla: this.movimientoPantalla
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
                            movimientoPantalla: this.movimientoPantalla
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
                            movimientoPantalla: this.movimientoPantalla
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
                            movimientoPantalla: this.movimientoPantalla
                        });
                    }
                },
            ];

        } )
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeMovimientoPantalla.complete();
    }
}


export type MovimientoPantallaComponentEventData =
{
    event: Event,
    sender: MovimientoPantallaComponent,
    movimientoPantalla: MovimientoPantalla
}


export enum StateComponentMovimientoPantallaComponent
{
    createMemory,
    updateMemory,
    readMemory,
    createServer,
    readServer,
    none
}


export enum StateDocumentMovimientoPantallaComponent
{
    draft,
    issued,
    canceled
}


export interface MovimientoPantallaComponentVm
{
    title: string,
    classesCss?: string,
    stateComponent: StateComponentMovimientoPantallaComponent,
    isStateComponentCustom?: boolean,
    isHeadActive: boolean,
    isCloseButtonActive: boolean,
    isAttached: boolean
}