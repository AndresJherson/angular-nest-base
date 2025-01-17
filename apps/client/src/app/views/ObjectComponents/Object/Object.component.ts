import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IComponent } from '../../../interfaces/IComponent';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ComponentStore } from '../../../services/ComponentStore';
import { ButtonsMenuComponentVm, ButtonsMenuComponent } from '../../Components/ButtonsMenu/ButtonsMenu.component';
import { ButtonsFooterComponentVm, ButtonsFooterComponent } from '../../Components/ButtonsFooter/ButtonsFooter.component';
import { ModalService } from '../../../services/modal.service';
import { PropBehavior } from '../../../../../../models/src/lib/Model';
import { MessageBoxComponent } from '../../Components/MessageBox/MessageBox.component';
import { BUTTON_CLASS_BOOTSTRAP } from '../../../utils/ButtonsClass';
import { FormsModule } from '@angular/forms';
import { ItemType } from '../../../interfaces/ItemType';

@Component({
  selector: 'app-object',
  imports: [
    CommonModule,
    AsyncPipe,
    ButtonsMenuComponent,
    FormsModule,
    ButtonsFooterComponent
],
  templateUrl: './Object.component.html',
  styleUrl: './Object.component.css',
})
export class ObjectComponent<T extends ItemType> implements IComponent<ObjectComponent<T>> {
    
    @Input() id = -1;
    @Input() store = new ComponentStore<T>( {symbol: Symbol()} as T, () => ({symbol: Symbol()} as T) );
    item: T = {symbol: Symbol()} as T;

    @Input() vm$ = new BehaviorSubject<ObjectComponentVm<T>>({
        title: '',
        classesCss: '',
        isCloseButtonActive: true,
        isReadButtonActive: true,
        state: StateObjectComponent.read,
        bindingProperties: []
    });

    @HostBinding( 'class' ) hostClasses: string = '';

    buttonsMenuComponentVm$ = new BehaviorSubject<ButtonsMenuComponentVm>({
        buttons: []
    });

    buttonsFooterComponentVm$ = new BehaviorSubject<ButtonsFooterComponentVm>({
        buttonsHtml: []
    });


    @Output() readonly onInit = new EventEmitter<ObjectComponent<T>>();
    @Output() readonly onDestroy = new EventEmitter<ObjectComponent<T>>();
    @Output() readonly onClose = new EventEmitter<ObjectComponentEventData<T>>();
    
    @Output() readonly onCreate = new EventEmitter<ObjectComponentEventData<T>>();
    @Output() readonly onUpdate = new EventEmitter<ObjectComponentEventData<T>>();
    @Output() readonly onDelete = new EventEmitter<ObjectComponentEventData<T>>();
    
    @Output() readonly onRead = new EventEmitter<ObjectComponentEventData<T>>();
    @Output() readonly onCancelUpdate = new EventEmitter<ObjectComponentEventData<T>>();

    sub = new Subscription();
    modalService = inject( ModalService );
    PropBehavior = PropBehavior;
    StateObjectComponent = StateObjectComponent;
    String = String;


    private buttonsMenu2read = () => {

        this.buttonsMenuComponentVm$.next({
            ...this.buttonsMenuComponentVm$.value,
            buttons: [
                {
                    title: 'Actualizar',
                    onClick: e => this.vm$.next({
                        ...this.vm$.value,
                        state: StateObjectComponent.update
                    })
                },
                {
                    title: 'Eliminar',
                    onClick: e => this.delete( e )
                },
            ]
        });

    }

    private buttonsMenu2create = () => {
        
        this.buttonsMenuComponentVm$.next({
            ...this.buttonsMenuComponentVm$.value,
            buttons: []
        });

    };

    private buttonsMenu2update = () => {
        
        this.buttonsMenuComponentVm$.next({
            ...this.buttonsMenuComponentVm$.value,
            buttons: [
                {
                    title: 'Eliminar',
                    onClick: e => this.delete( e )
                },
            ]
        });

    };


    private buttonsFooter2read = () => {

        this.buttonsFooterComponentVm$.next({
            ...this.buttonsFooterComponentVm$.value,
            buttonsHtml: []
        });

    }

    private buttonsFooter2create = () => {
        
        this.buttonsFooterComponentVm$.next({
            ...this.buttonsFooterComponentVm$.value,
            buttonsHtml: [
                {
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    title: 'Cancelar',
                    onClick: e => this.close( e )
                },
                {
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    title: 'Confirmar',
                    onClick: e => this.create( e )
                },
            ]
        });

    };


    private buttonsFooter2update = () => {

        this.buttonsFooterComponentVm$.next({
            ...this.buttonsFooterComponentVm$.value,
            buttonsHtml: [
                {
                    class: BUTTON_CLASS_BOOTSTRAP.secondary,
                    title: 'Cancelar',
                    onClick: e => {
                        this.store.getRead().subscribe( () => {

                            this.vm$.next({
                                ...this.vm$.value,
                                state: StateObjectComponent.read
                            });

                            this.onCancelUpdate.emit({
                                event: e,
                                sender: this,
                                item: this.item
                            });
                            
                        } );
                    }
                },
                {
                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                    title: 'Confirmar',
                    onClick: e => this.update( e )
                },
            ]
        });

    }


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.store.state$.subscribe({
            next: state => {
                this.item = state;
                if ( this.vm$.value.state === StateObjectComponent.create ) {
                    console.log('state de objectComponent create');
                }
                else if ( this.vm$.value.state === StateObjectComponent.read ) {
                    console.log('state de objectComponent read');   
                }
            },
            error: error => this.close( new Event( 'click' ) )
        }) );

        this.sub.add( this.vm$.subscribe( vm => {

            this.hostClasses = vm.classesCss ?? '';

            if ( vm.state === StateObjectComponent.read ) {

                this.buttonsMenu2read();
                this.buttonsFooter2read();

            }
            else if ( vm.state === StateObjectComponent.create ) {

                this.buttonsMenu2create();
                this.buttonsFooter2create();

            }
            else if ( vm.state === StateObjectComponent.update ) {

                this.buttonsMenu2update();
                this.buttonsFooter2update();

            }

        } ) );

        this.sub.add( this.store.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );
    }


    close( e: Event )
    {
        this.modalService.close( this );
        this.onClose.emit({
            event: e,
            sender: this,
            item: this.item
        });
    }

    
    read( e: Event )
    {
        this.store.getRead().subscribe();
        this.onRead.emit({
            event: e,
            sender: this,
            item: this.item
        });
    }


    create( e: Event )
    {
        try {
            this.verifyRequired();
            this.onCreate.emit({
                event: e,
                sender: this,
                item: this.item
            });
        }
        catch ( error: any ) {
            this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error.message );
        }
    }


    update( e: Event )
    {
        try {
            this.verifyRequired();
            this.onUpdate.emit({
                event: e,
                sender: this,
                item: this.item
            });
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
                            item: this.item
                        });
                    }
                },
            ];

        } )
    }


    verifyRequired()
    {
        this.vm$.value.bindingProperties.forEach( bind => {

            if (
                bind.setValue &&
                ( bind.getValue( this.item, true ) === undefined || 
                ( bind.getValue( this.item, true ) !== undefined && bind.getValue( this.item, true ) !== null && String( bind.getValue( this.item, true ) ).trim().length === 0 ) ) &&
                bind.required
            ) {
                throw new Error ( `El campo ${ bind.title } es requerido!` )
            }

        } )
    }


    ngOnDestroy(): void 
    {
        console.log( ObjectComponent.name, 'destruido' );
        this.onDestroy.emit( this );
        this.store.complete();
        this.sub.unsubscribe();
    }

}


export type ObjectComponentEventData<T extends ItemType> = 
{
    event: Event,
    sender: ObjectComponent<T>,
    item: T
}


export enum StateObjectComponent
{
    read,
    create,
    update,
    none
}


export interface BindingPropertyObjectComponent<T extends ItemType>
{
    title: string;
    getValue: ( item: T, original?: boolean ) => T[keyof T] | undefined;
    setValue?: ( item: T, value?: any ) => void;
    readonly?: boolean;
    required?: boolean;
    onClick?: ( item: T ) => void;
    behavior: PropBehavior;
}


export interface ObjectComponentVm<T extends ItemType>
{
    title: string;
    classesCss?: string;
    isCloseButtonActive: boolean;
    isReadButtonActive: boolean;
    state: StateObjectComponent;
    bindingProperties: BindingPropertyObjectComponent<T>[];
}