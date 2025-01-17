import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from '../../../interfaces/IComponent';
import { ItemType } from '../../../interfaces/ItemType';
import { ComponentStore } from '../../../services/ComponentStore';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { InputSearchComponentEventData, InputSearchComponentVm, InputSearchComponent } from '../../Components/InputSearch/InputSearch.component';
import { ButtonsFooterComponentVm, ButtonsFooterComponent } from '../../Components/ButtonsFooter/ButtonsFooter.component';
import { ModalService } from '../../../services/modal.service';
import { BUTTON_CLASS_BOOTSTRAP } from '../../../utils/ButtonsClass';
import { FormsModule } from '@angular/forms';
import { MessageBoxComponent } from '../../Components/MessageBox/MessageBox.component';

@Component({
  selector: 'app-list-select',
  imports: [
    CommonModule,
    FormsModule,
    InputSearchComponent,
    ButtonsFooterComponent
],
  templateUrl: './ListSelect.component.html',
  styleUrl: './ListSelect.component.css',
})
export class ListSelectComponent<T extends ItemType> implements IComponent<ListSelectComponent<T>> {

    @Input() id = 0;
    @Input() store = new ComponentStore<T[]>([],of([]));
    secondStore = this.store.storeFromThis<T[]>( state => state );
    data: T[] = [];
    itemSelected?: T;

    @Input() vm$ = new BehaviorSubject<ListSelectComponentVm<T>>({
        title: '',
        classesCss: '',
        displayValue: item => undefined
    });

    @HostBinding( 'class' ) hostClasses: string = '';

    inputSearchComponentVm$ = new BehaviorSubject<InputSearchComponentVm<T>>({
        value2search: '',
        bindingProperties: [
            {
                getValue: item => this.vm$.value.displayValue( item )
            }
        ]
    });

    buttonsFooterComponentVm$ = new BehaviorSubject<ButtonsFooterComponentVm>({
        buttonsHtml: [
            {
                class: BUTTON_CLASS_BOOTSTRAP.secondary,
                title: 'Cancelar',
                onClick: ( e: Event ) => this.close( e )
            },
            {
                class: BUTTON_CLASS_BOOTSTRAP.primary,
                title: 'Ok',
                onClick: ( e: Event ) => this.confirm( e )
            },
        ]
    });


    @Output() readonly onInit = new EventEmitter<ListSelectComponent<T>>();
    @Output() readonly onDestroy = new EventEmitter<ListSelectComponent<T>>();
    @Output() readonly onSelect = new EventEmitter<ListSelectComponentEventData<T>>();

    sub = new Subscription();
    modalService = inject( ModalService );


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.secondStore = this.store.storeFromThis( state => state );

        this.sub.add( this.secondStore.state$.subscribe( state => {
            this.data = state;
        } ) );

        this.sub.add( this.secondStore.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );

        this.sub.add( this.vm$.subscribe( vm => {
            this.hostClasses = vm.classesCss ?? '';
        } ) );
    }


    getItemSelected(): T | undefined
    {
        return this.itemSelected;
    }


    setItemSelected( value?: T )
    {
        if ( value === undefined ) {
            this.itemSelected = undefined;
            return;
        }

        this.itemSelected = this.store.getState().find( item => item.symbol === value.symbol )
                            ?? this.store.getState().find( item => item.id === value.id )
                            
    }


    close( e: Event )
    {
        this.modalService.close( this );
    }


    search( e: InputSearchComponentEventData<T> )
    {
        this.secondStore.setState( e.data );
    }


    confirm( e: Event )
    {
        this.onSelect.emit({
            event: e,
            sender: this,
            item: this.itemSelected
        });
        
        this.close( e );
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.sub.unsubscribe();
        this.store.complete();
        this.secondStore.complete();
    }
}


export interface ListSelectComponentVm<T extends ItemType>
{
    title: string;
    classesCss?: string;
    displayValue: ( item: T ) => T[keyof T] | undefined;
}


export type ListSelectComponentEventData<T extends ItemType> =
{
    event: Event,
    sender: ListSelectComponent<T>,
    item?: T
}