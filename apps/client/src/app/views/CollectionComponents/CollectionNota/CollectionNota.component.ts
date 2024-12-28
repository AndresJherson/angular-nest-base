import { Component, ElementRef, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from '../../../interfaces/IComponent';
import { Subscription } from 'rxjs';
import { ComponentStore } from '../../../services/ComponentStore';
import { Nota } from 'apps/models/src/lib/DocumentosTransaccion/Nota';
import { MessageBoxComponent } from '../../Components/MessageBox/MessageBox.component';
import { ModalService } from '../../../services/modal.service';
import { Prop } from '../../../../../../models/src/lib/Model';
import { BUTTON_CLASS_BOOTSTRAP } from '../../../utils/ButtonsClass';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collection-nota',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './CollectionNota.component.html',
  styleUrl: './CollectionNota.component.css',
})
export class CollectionNotaComponent implements IComponent<CollectionNotaComponent> {

    static id = 0;
    instanceId = 0;
    @Input() storeNotas = new ComponentStore<NotaRefCollectionNotaComponent[]>( [], ()=>[] );
    notas: NotaRefCollectionNotaComponent[] = [];
    nota2create = new Nota();

    @Output() readonly onInit = new EventEmitter<CollectionNotaComponent>();
    @Output() readonly onDestroy = new EventEmitter<CollectionNotaComponent>();

    @Output() readonly onCreate = new EventEmitter<CollectionNotaComponentEventData>();
    @Output() readonly onDelete = new EventEmitter<CollectionNotaComponentEventData>();
    
    sub: Subscription = new Subscription();
    modalService = inject( ModalService );
    isCreate = false;
    Prop = Prop;


    @ViewChildren( 'containerMenu' ) containersMenu?: QueryList<ElementRef<HTMLInputElement>>;
    @ViewChildren( 'buttonMenu' ) buttonsMenu?: QueryList<ElementRef<HTMLInputElement>>;
    private onClickWindow = ( e: Event ) => {
        if ( !this.containersMenu?.some( b => b.nativeElement.contains( e.target as any ) ) ) {
            this.buttonsMenu?.forEach( b => b.nativeElement.checked = false )
        }
    }

    constructor()
    {
        CollectionNotaComponent.id++;
        this.instanceId ^= CollectionNotaComponent.id;
    }

    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storeNotas.state$.subscribe({
            next: notas => {
                this.notas = notas.map( nota => {

                    const interval = Prop.toInterval( Prop.toDateTime( nota.fechaCreacion ), Prop.toDateTimeNow() );
                    const years = Prop.toDecimal( interval.length( 'year' ) ).toDecimalPlaces( 0 ).toNumber();
                    const months = Prop.toDecimal( interval.length( 'month' ) ).toDecimalPlaces( 0 ).toNumber();
                    const days = Prop.toDecimal( interval.length( 'day' ) ).toDecimalPlaces( 0 ).toNumber();
                    const hours = Prop.toDecimal( interval.length( 'hour' ) ).toDecimalPlaces( 0 ).toNumber();
                    const minutes = Prop.toDecimal( interval.length( 'minute' ) ).toDecimalPlaces( 0 ).toNumber();
                    
                    nota.tiempoTranscurrido = minutes < 60
                                            ? `hace ${minutes} minutos`
                                            : hours < 24
                                                ? `hace ${hours} horas`
                                                : days < 30
                                                    ? `hace ${days} dias`
                                                    : months < 12
                                                        ? `hace ${months} meses`
                                                        : Prop.setNumberStrict( years ) !== undefined
                                                            ? `hace ${years} años`
                                                            : ''

                    return nota;
                } )
            },
            error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
        }) );

        this.sub.add( this.storeNotas.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );
    }


    ngAfterViewInit()
    {
        window.addEventListener( 'click', this.onClickWindow );
    }


    readText( text: string ): string[]
    {
        return text ? text.split(/\r?\n/) : [];
    }


    createNota( e: Event )
    {
        this.onCreate.emit({
            event: e,
            sender: this,
            nota: new Nota( this.nota2create )
        });
        this.reset();
    }


    reset()
    {
        this.isCreate = false;
        this.nota2create = new Nota();
    }


    deleteNota( nota: Nota )
    {
        this.modalService.open( MessageBoxComponent ).subscribe( c => {
        
                    c.mensaje = "¿Estás seguro que deseas eliminar el comentario?";
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
                                    nota: nota
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
        this.storeNotas.complete();
        window.removeEventListener( 'click', this.onClickWindow );
    }
}


export interface NotaRefCollectionNotaComponent extends Nota
{
    tiempoTranscurrido?: string
}


export type CollectionNotaComponentEventData =
{
    event: Event,
    sender: CollectionNotaComponent,
    nota: Nota
}