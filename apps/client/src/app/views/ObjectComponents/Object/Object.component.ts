import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IComponent } from '../../../interfaces/IComponent';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ComponentStore } from '../../../services/ComponentStore';
import { Model } from 'apps/models/src/lib/Model';
import { ButtonsMenuComponentVm, ButtonsMenuComponent } from '../../Components/ButtonsMenu/ButtonsMenu.component';
import { ButtonsFooterComponentVm, ButtonsFooterComponent } from '../../Components/ButtonsFooter/ButtonsFooter.component';
import { ModalService } from '../../../services/modal.service';
import { PropBehavior } from '../../../../../../models/src/lib/Model';
import { MessageBoxComponent } from '../../Components/MessageBox/MessageBox.component';
import { BUTTON_CLASS_BOOTSTRAP } from '../../../utils/ButtonsClass';
import { FormsModule } from '@angular/forms';

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
export class ObjectComponent<T extends Model> implements IComponent<ObjectComponent<T>> {
    
    @Input() id = -1;
    @Input() store = new ComponentStore<T>( new Model() as T, of(new Model() as T) );
    item: T = new Model() as T;

    @Input() vm$ = new BehaviorSubject<ObjectComponentVm<T>>({
        title: '',
        state: StateObjectComponent.read,
        bindingProperties: []
    });

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

    sub = new Subscription();
    modalService = inject( ModalService );
    PropBehavior = PropBehavior;
    StateObjectComponent = StateObjectComponent;


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
                        this.store.read().subscribe();
                        this.vm$.next({
                            ...this.vm$.value,
                            state: StateObjectComponent.read
                        });
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
            next: state => this.item = state,
            error: error => this.close( new Event( 'click' ) )
        }) );

        this.sub.add( this.vm$.subscribe( vm => {

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


    create( e: Event )
    {
        try {

            this.item.checkProperties2send();
            
            this.onCreate.emit({
                event: e,
                sender: this,
                item: this.item
            });

        }
        catch ( error: any ) {
            this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error );
        }
    }


    update( e: Event )
    {
        try {

            this.item.checkProperties2send();
            
            this.onUpdate.emit({
                event: e,
                sender: this,
                item: this.item
            });

        }
        catch ( error: any ) {
            this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error );
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


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.sub.unsubscribe();
    }
}


export type ObjectComponentEventData<T extends Model> = 
{
    event: Event,
    sender: ObjectComponent<T>,
    item: T
}


export enum StateObjectComponent
{
    read,
    create,
    update
}


export interface BindingPropertyObjectComponent<T extends Model>
{
    title: string;
    getValue: ( item: T, object?: boolean ) => T[keyof T] | undefined;
    setValue?: ( item: T, value?: any ) => void;
    onClick?: ( item: T ) => void;
    readonly?: boolean;
    behavior: PropBehavior;
}


export interface ObjectComponentVm<T extends Model>
{
    title: string;
    state: StateObjectComponent;
    bindingProperties: BindingPropertyObjectComponent<T>[];
}