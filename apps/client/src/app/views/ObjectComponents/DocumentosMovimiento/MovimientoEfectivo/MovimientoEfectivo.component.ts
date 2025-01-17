import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { MedioTransferenciaService } from 'apps/client/src/app/models/DocumentosMovimiento/medio-transferencia.service';
import { FormsModule } from '@angular/forms';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { MovimientoEfectivo, Prop } from '@app/models';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { ButtonsFooterComponentVm, ButtonsFooterComponent } from '../../../Components/ButtonsFooter/ButtonsFooter.component';
import { ButtonsMenuComponent, ButtonsMenuComponentVm } from "../../../Components/ButtonsMenu/ButtonsMenu.component";
import { BUTTON_CLASS_BOOTSTRAP } from 'apps/client/src/app/utils/ButtonsClass';
import { DocumentoTransaccionService } from 'apps/client/src/app/models/DocumentosTransaccion/documento-transaccion.service';

@Component({
  selector: 'app-movimiento-efectivo',
  imports: [
    CommonModule,
    FormsModule,
    ButtonsFooterComponent,
    ButtonsMenuComponent
],
  templateUrl: './MovimientoEfectivo.component.html',
  styleUrl: './MovimientoEfectivo.component.css',
})
export class MovimientoEfectivoComponent implements IComponent<MovimientoEfectivoComponent> 
{
    @Input() storeMovimientoEfectivo = new ComponentStore( new MovimientoEfectivo, () => new MovimientoEfectivo() );
    movimientoEfectivo = new MovimientoEfectivo();
    
    @Input() vm$ = new BehaviorSubject<MovimientoEfectivoVm>({
        title: 'Movimiento de Efectivo',
        stateComponent: StateComponentMovimientoEfectivoComponent.readMemory,
        isAttached: true
    });

    @HostBinding( 'class' ) hostClasses: string = '';
    
    @Input() buttonsMenuComponentVm$ = new BehaviorSubject<ButtonsMenuComponentVm>({
        buttons: []
    });

    @Input() buttonsFooterComponentVm$ = new BehaviorSubject<ButtonsFooterComponentVm>({
        buttonsHtml: []
    });

    @Output() readonly onInit = new EventEmitter<MovimientoEfectivoComponent>();
    @Output() readonly onDestroy = new EventEmitter<MovimientoEfectivoComponent>();

    @Output() readonly onCreate = new EventEmitter<MovimientoEfectivoComponentEventData>();
    @Output() readonly onUpdate = new EventEmitter<MovimientoEfectivoComponentEventData>();
    @Output() readonly onDelete = new EventEmitter<MovimientoEfectivoComponentEventData>();

    @Output() readonly onIssue = new EventEmitter<MovimientoEfectivoComponentEventData>();
    @Output() readonly onCancel = new EventEmitter<MovimientoEfectivoComponentEventData>();

    sub: Subscription = new Subscription();
    modalService = inject( ModalService );
    medioTransferenciaService = inject( MedioTransferenciaService );
    documentoTransaccionService = inject( DocumentoTransaccionService );
    stateDocument = StateDocumentMovimientoEfectivoComponent.draft;
    StateComponentMovimientoEfectivoComponent = StateComponentMovimientoEfectivoComponent;
    Prop = Prop;


    // MEMORY

    // CREATE
    private buttonsFooter2createMemory = () => {
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
    private buttonsMenu2readMemory = () => {
        this.buttonsMenuComponentVm$.next({
            buttons: [
                {
                    title: 'Actualizar',
                    onClick: e => this.vm$.next({
                        ...this.vm$.value,
                        stateComponent: StateComponentMovimientoEfectivoComponent.updateMemory
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
    private buttonsMenu2updateMemory = () => {
        this.buttonsMenuComponentVm$.next({
            buttons: [
                {
                    title: 'Eliminar',
                    onClick: e => this.delete( e )
                }
            ]
        });
    };
    private buttonsFooter2updateMemory = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: [
                {
                    title: 'Cancelar',
                    class: BUTTON_CLASS_BOOTSTRAP.light,
                    onClick: e => {
                        this.storeMovimientoEfectivo.getRead().subscribe( () => {
                            this.vm$.next({
                                ...this.vm$.value,
                                stateComponent: StateComponentMovimientoEfectivoComponent.readMemory
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
    private buttonsFooter2createServer = () => {
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
    private buttonsFooter2readServerIssue = () => {
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
    private buttonsMenu2none = () => {
        this.buttonsMenuComponentVm$.next({
            buttons: []
        });
    };
    private buttonsFooter2none = () => {
        this.buttonsFooterComponentVm$.next({
            buttonsHtml: []
        });
    };



    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storeMovimientoEfectivo.state$.subscribe( item => {

            this.movimientoEfectivo = item;
            
            this.stateDocument = this.movimientoEfectivo.fechaAnulacion
                                    ? StateDocumentMovimientoEfectivoComponent.canceled
                                : this.movimientoEfectivo.fechaEmision
                                    ? StateDocumentMovimientoEfectivoComponent.issued
                                    : StateDocumentMovimientoEfectivoComponent.draft;

            this.vm$.next({...this.vm$.value});

        } ) );

        this.sub.add( this.storeMovimientoEfectivo.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) )

        this.sub.add( this.vm$.subscribe( vm => {

            this.hostClasses = vm.classesCss ?? '';

            if ( vm.stateComponent === StateComponentMovimientoEfectivoComponent.createMemory ) {

                this.buttonsMenu2none();
                this.buttonsFooter2createMemory();

            }
            else if ( vm.stateComponent === StateComponentMovimientoEfectivoComponent.updateMemory ) {
                
                this.buttonsMenu2updateMemory();
                this.buttonsFooter2updateMemory();

            }
            else if ( vm.stateComponent === StateComponentMovimientoEfectivoComponent.readMemory ) {
                
                this.buttonsMenu2readMemory();
                this.buttonsFooter2none();

            }
            else if ( vm.stateComponent === StateComponentMovimientoEfectivoComponent.createServer ) {

                this.buttonsMenu2none();
                this.buttonsFooter2createServer();

            }
            else if ( vm.stateComponent === StateComponentMovimientoEfectivoComponent.readServer ) {
                
                if ( this.stateDocument === StateDocumentMovimientoEfectivoComponent.issued ) {
                    this.buttonsMenu2none();
                    this.buttonsFooter2readServerIssue();
                }
                else {
                    this.buttonsMenu2none();
                    this.buttonsFooter2none();
                }

            }
            else if ( vm.stateComponent === StateComponentMovimientoEfectivoComponent.none ) {
                
                this.buttonsMenu2none();
                this.buttonsFooter2none();

            }

        } ) );
    }


    selectMedioTransferencia( e: Event )
    {
        this.medioTransferenciaService.openTableComponent2selectItem().subscribe( c => {

            c.sub.add( c.store.state$.subscribe( () => 
                this.movimientoEfectivo.medioTransferencia
                ? c.setDataChecked([ this.movimientoEfectivo.medioTransferencia ])
                : undefined
            ) );

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeMovimientoEfectivo.setState( movimientoEfectivo => MovimientoEfectivo.initialize([{
                    ...movimientoEfectivo,
                    medioTransferencia: e.item
                }])[0] )
            } ) );

            c.sub.add( c.onResetItem.subscribe( e => {
                this.storeMovimientoEfectivo.setState( movimientoEfectivo => MovimientoEfectivo.initialize([{
                    ...movimientoEfectivo,
                    medioTransferencia: e.item
                }])[0] )
            } ) );

        } );
    }


    selectDocumentoTransaccion( e: Event )
    {
        this.documentoTransaccionService.openTableComponent2selectIssued().subscribe( c => {

            c.sub.add( c.store.state$.subscribe( () => 
                this.movimientoEfectivo.documentoTransaccion
                    ? c.setDataChecked([ this.movimientoEfectivo.documentoTransaccion ])
                    : undefined
            ) )

            c.sub.add( c.onSelectItem.subscribe( e => {
                this.storeMovimientoEfectivo.setState( movimientoEfectivo => MovimientoEfectivo.initialize([{
                    ...movimientoEfectivo,
                    documentoTransaccion: e.item
                }])[0] )
            } ) );

            c.sub.add( c.onResetItem.subscribe( e => {
                this.storeMovimientoEfectivo.setState( movimientoEfectivo => MovimientoEfectivo.initialize([{
                    ...movimientoEfectivo,
                    documentoTransaccion: e.item
                }])[0] )
            } ) )

        } )
    }


    close( e: Event )
    {
        this.modalService.close( this );
    }


    create( e: Event )
    {
        try {
            this.verifyRequired();
            this.onCreate.emit({
                event: e,
                sender: this,
                movimientoEfectivo: this.movimientoEfectivo
            });
            this.close( e )
        }
        catch ( error: any ) {
            this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message );
        }
    }


    update( e: Event )
    {
        try {
            this.verifyRequired();
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
                                movimientoEfectivo: this.movimientoEfectivo
                            });
                            this.close( e );
                        }
                    },
                ];
    
            } )
        }
        catch ( error: any ) {
            this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message );
        }
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
                            movimientoEfectivo: this.movimientoEfectivo
                        });
                        this.close( e );
                    }
                },
            ];

        } )
    }


    issue( e: Event )
    {
        try {
            this.verifyRequired();
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
                                movimientoEfectivo: this.movimientoEfectivo
                            });
                        }
                    },
                ];
    
            } )
        }
        catch ( error: any ) {
            this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message );
        }
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
                            movimientoEfectivo: this.movimientoEfectivo
                        });
                    }
                },
            ];

        } )
    }


    verifyRequired()
    {
        if ( this.movimientoEfectivo.medioTransferencia?.id === undefined ) throw new Error( 'El campo Medio de Transferencia es requerido!' );
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeMovimientoEfectivo.complete();
        this.sub.unsubscribe();
    }

}


export type MovimientoEfectivoComponentEventData =
{
    event: Event,
    sender: MovimientoEfectivoComponent,
    movimientoEfectivo: MovimientoEfectivo
}


export enum StateDocumentMovimientoEfectivoComponent
{
    draft,
    issued,
    canceled
}


export enum StateComponentMovimientoEfectivoComponent
{
    createMemory,
    updateMemory,
    readMemory,
    createServer,
    readServer,
    none
}


export interface MovimientoEfectivoVm
{
    title: string,
    stateComponent: StateComponentMovimientoEfectivoComponent,
    classesCss?: string,
    isAttached: boolean
}