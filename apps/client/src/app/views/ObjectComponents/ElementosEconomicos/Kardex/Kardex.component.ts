import { Component, ElementRef, EventEmitter, HostBinding, inject, Input, Output, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Bien, Kardex, KardexMovimiento, PantallaModeloCalidad, Prop } from '@app/models';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { PantallaModeloCalidadService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo-calidad.service';

@Component({
  selector: 'app-kardex',
  imports: [
    CommonModule,
    AsyncPipe
],
  templateUrl: './Kardex.component.html',
  styleUrl: './Kardex.component.css',
})
export class KardexComponent<T extends Bien> implements IComponent<KardexComponent<T>> {

    pantallaModeloCalidadService = inject( PantallaModeloCalidadService )
    @Input() storeKardex = new ComponentStore<Kardex<T>>( new Kardex(), this.pantallaModeloCalidadService.kardexMetodoPromedio( new PantallaModeloCalidad({ id: 32 }) ) as Observable<Kardex<T>> );
    kardex = new Kardex<T>();
    selectedItem?: KardexMovimiento;

    @Input() vm$ = new BehaviorSubject<KardexComponentVm>({
        isCloseButtonActive: true,
        title: 'Kardex'
    });

    @HostBinding( 'class' ) hostClasses: string = '';

    @Output() readonly onInit = new EventEmitter<KardexComponent<T>>();
    @Output() readonly onDestroy = new EventEmitter<KardexComponent<T>>();
    @Output() readonly onClose = new EventEmitter<KardexComponentEventData<T>>();

    sub: Subscription = new Subscription();
    modalService = inject( ModalService );
    Prop = Prop;

    @ViewChild( 'tbody' ) tbody?: ElementRef<HTMLElement>;
    private onClickDocument = ( e: Event ) => {
        if ( !this.tbody?.nativeElement.contains( e.target as HTMLElement ) ) {
            this.selectedItem = undefined;

        }
    }


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storeKardex.state$.subscribe( state => {
            this.kardex = state;
        } ) );

        this.sub.add( this.storeKardex.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );

        this.sub.add( this.vm$.subscribe( vm => {
            this.hostClasses = vm.classesCss ?? '';
        } ) );

        this.storeKardex.getRead().subscribe();
    }


    ngAfterViewInit()
    {
        document.addEventListener( 'click', this.onClickDocument );
    }


    close( e: Event )
    {
        this.onClose.emit({
            event: e,
            sender: this,
            kardex: this.kardex
        });
    }


    read( e: Event )
    {
        this.storeKardex.getRead().subscribe();
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeKardex.complete();
        document.removeEventListener( 'click', this.onClickDocument );
        this.sub.unsubscribe();
    }
}


export type KardexComponentEventData<T extends Bien> =
{
    event: Event,
    sender: KardexComponent<T>,
    kardex: Kardex<T>
}


export interface KardexComponentVm
{
    isCloseButtonActive: boolean,
    title: string,
    classesCss?: string,
}