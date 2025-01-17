import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { PantallaModeloCalidad, PropBehavior } from '@app/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OverlayService } from 'apps/client/src/app/services/overlay.service';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { PantallaModeloCalidadService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo-calidad.service';
import { PantallaModeloService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo.service';
import { CalidadService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/Pantalla/calidad.service';
import { ObjectComponent, StateObjectComponent } from '../../Object/Object.component';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { KardexComponent } from '../Kardex/Kardex.component';
import { TabComponent, TabItemComponent } from "../../../Components/Tab/Tab.component";

@Component({
  selector: 'app-pantalla-modelo-calidad',
  imports: [CommonModule, TabComponent, TabItemComponent, ObjectComponent, KardexComponent],
  templateUrl: './PantallaModeloCalidad.component.html',
  styleUrl: './PantallaModeloCalidad.component.css',
})
export class PantallaModeloCalidadComponent implements IComponent<PantallaModeloCalidadComponent> {

    @Input() storePantallaModeloCalidad = new ComponentStore<PantallaModeloCalidad>( new PantallaModeloCalidad(), () => new PantallaModeloCalidad() );
    pantallaModeloCalidad = new PantallaModeloCalidad();

    @Input() vm$ = new BehaviorSubject<PantallaModeloCalidadComponentVm>({
        classesCss: ''
    })
    
    @Input() overlayService = new OverlayService();

    @HostBinding( 'class' ) hostClasses: string = '';

    @Output() readonly onInit = new EventEmitter<PantallaModeloCalidadComponent>();
    @Output() readonly onDestroy = new EventEmitter<PantallaModeloCalidadComponent>();
    @Output() readonly onClose = new EventEmitter<PantallaModeloCalidadComponentEventData>();

    sub: Subscription = new Subscription();
    modalService = inject( ModalService );
    pantallaModeloCalidadService = inject( PantallaModeloCalidadService );
    pantallaModeloService = inject( PantallaModeloService );
    calidadService = inject( CalidadService );


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storePantallaModeloCalidad.state$.subscribe( pantallaModeloCalidad => {

            this.pantallaModeloCalidad = pantallaModeloCalidad;

        } ) );

        this.sub.add( this.storePantallaModeloCalidad.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );

        this.sub.add( this.vm$.subscribe( vm => {
            this.hostClasses = vm.classesCss ?? '';
        } ) );
    }

    
    close( e: Event )
    {
        this.onClose.emit({
            event: e,
            sender: this,
            pantallaModeloCalidad: this.pantallaModeloCalidad
        });
        this.modalService.close( this );
    }


    // PantallaModeloCalidad
    objectComponentOnInit( c: ObjectComponent<PantallaModeloCalidad> )
    {
        c.store = this.storePantallaModeloCalidad.storeFromThisAsync( this.pantallaModeloCalidad, this.pantallaModeloCalidadService.getItem( this.pantallaModeloCalidad ) );

        c.vm$.next({
            title: '',
            classesCss: '',
            isCloseButtonActive: false,
            isReadButtonActive: true,
            state: StateObjectComponent.read,
            bindingProperties: [
                { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
                { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
                { title: 'Modelo', getValue: item => item.pantallaModelo?.nombre, setValue: ( item, value ) => item.set({ pantallaModelo: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                    this.pantallaModeloService.openTableComponent2selectItem().subscribe( tc => {

                        tc.sub.add( tc.store.state$.subscribe( () =>
                            item.pantallaModelo
                            ? tc.setDataChecked([ item.pantallaModelo ])
                            : undefined
                        ) );

                        tc.sub.add( tc.onSelectItem.subscribe( e => {
                            c.store.setState( pantalla => new PantallaModeloCalidad({
                                ...pantalla,
                                pantallaModelo: e.item
                            }) )
                        } ) );

                        tc.sub.add( tc.onResetItem.subscribe( e => {
                            c.store.setState( pantalla => new PantallaModeloCalidad({
                                ...pantalla,
                                pantallaModelo: e.item
                            }) )
                        } ) );

                    } );
                } },
                { title: 'Marca', getValue: item => item.pantallaModelo?.pantallaMarca?.nombre, behavior: PropBehavior.string },
                { title: 'Calidad', getValue: item => item.calidad?.nombre, setValue: ( item, value ) => item.set({ calidad: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                    this.calidadService.openTableComponent2selectItem().subscribe( tc => {

                        tc.sub.add( tc.store.state$.subscribe( () =>
                            item.calidad
                            ? tc.setDataChecked([ item.calidad ])
                            : undefined
                        ) );

                        tc.sub.add( tc.onSelectItem.subscribe( e => {
                            c.store.setState( pantalla => new PantallaModeloCalidad({
                                ...pantalla,
                                calidad: e.item
                            }) );
                        } ) );
                        
                        tc.sub.add( tc.onResetItem.subscribe( e => {
                            c.store.setState( pantalla => new PantallaModeloCalidad({
                                ...pantalla,
                                calidad: e.item
                            }) );
                        } ) );

                    } );
                } },
                { title: 'Precio Uni', getValue: item => item.precioUnitario, setValue: ( item, value ) => item.set({ precioUnitario: value }), required: true, behavior: PropBehavior.number },
            ]
        });


        c.sub.add( c.onUpdate.subscribe( e => {

            this.pantallaModeloCalidadService.updateItem( e.item ).subscribe({
                next: item => {
                    this.storePantallaModeloCalidad.setRead( () => item )
                                                    .getRead()
                                                    .subscribe();

                    c.vm$.next({ ...c.vm$.value, state: StateObjectComponent.read });
                },
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            })

        } ) );

        c.sub.add( c.onDelete.subscribe( e => {

            this.pantallaModeloCalidadService.deleteItem( e.item ).subscribe({
                next: () => this.close( e.event ),
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            })

        } ) );
    }


    // Documentos Transacción Relacionado
    kardexComponentOnInit( c: KardexComponent<PantallaModeloCalidad> )
    {
        c.storeKardex.setRead( this.pantallaModeloCalidadService.kardexMetodoPromedio( this.pantallaModeloCalidad ) )
                    .getRead()
                    .subscribe();

        c.vm$.next({
            title: `Kardex [ ${this.pantallaModeloCalidad.nombre ?? ''} ]`,
            isCloseButtonActive: false
        });
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storePantallaModeloCalidad.complete();
        this.sub.unsubscribe();
    }
}


export interface PantallaModeloCalidadComponentEventData
{
    event: Event,
    sender: PantallaModeloCalidadComponent,
    pantallaModeloCalidad: PantallaModeloCalidad
}


export interface PantallaModeloCalidadComponentVm
{
    classesCss?: string,
}