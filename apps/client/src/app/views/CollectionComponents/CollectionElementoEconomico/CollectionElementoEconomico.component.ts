import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from '../../../interfaces/IComponent';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { InputSearchComponent, InputSearchComponentEventData, InputSearchComponentVm } from "../../Components/InputSearch/InputSearch.component";
import { ElementoEconomico, PantallaModeloCalidad, Producto, Servicio } from '@app/models';
import { ProductoService } from '../../../models/ElementosEconomicos/Bien/Producto/producto.service';
import { PantallaModeloCalidadService } from '../../../models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo-calidad.service';
import { ServicioService } from '../../../models/ElementosEconomicos/Servicio/servicio.service';
import { ComponentStore } from '../../../services/ComponentStore';
import { MessageBoxComponent } from '../../Components/MessageBox/MessageBox.component';
import { TabComponent, TabItemComponent } from "../../Components/Tab/Tab.component";

@Component({
  selector: 'app-collection-elemento-economico',
  imports: [CommonModule, InputSearchComponent, TabComponent, TabItemComponent],
  templateUrl: './CollectionElementoEconomico.component.html',
  styleUrl: './CollectionElementoEconomico.component.css',
})
export class CollectionElementoEconomicoComponent implements IComponent<CollectionElementoEconomicoComponent> 
{
    @Output() readonly onInit = new EventEmitter<CollectionElementoEconomicoComponent>();
    @Output() readonly onDestroy = new EventEmitter<CollectionElementoEconomicoComponent>();
    @Output() readonly onSelectItem = new EventEmitter<CollectionElementoEconomicoComponentEventData>();

    sub: Subscription = new Subscription();
    modalService = inject( ModalService );

    recursiveSearch = 0;
    inputSearchComponentVm$ = new BehaviorSubject<InputSearchComponentVm<ElementoEconomico>>({
        value2search: '',
        bindingProperties: [
            { getValue: item => item.nombre },
            { getValue: item => item.codigo },
            { getValue: item => item.uuid },
        ]
    });


    productoService = inject( ProductoService );
    storeProducto = new ComponentStore<Producto[]>( [], () => [] );
    productoData: Producto[] = [];
    
    pantallaModeloCalidadService = inject( PantallaModeloCalidadService );
    storePantallaModeloCalidad = new ComponentStore<PantallaModeloCalidad[]>( [], () => [] );
    pantallaModeloCalidadData: PantallaModeloCalidad[] = [];
    
    servicioService = inject( ServicioService );
    storeServicio = new ComponentStore<Servicio[]>( [], () => [] );
    servicioData: Servicio[] = [];


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.productoService.getCollection().subscribe({
            next: data => this.storeProducto.setState( data ),
            error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
        });

        // this.pantallaModeloCalidadData.get.subscribe({
        //     next: data => this.productoData = data,
        //     error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
        // });

        this.servicioService.getCollection().subscribe({
            next: data => this.storeServicio.setState( data ),
            error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
        });


        this.sub.add( this.storeProducto.state$.subscribe( data => this.productoData = data ) );
        this.sub.add( this.storePantallaModeloCalidad.state$.subscribe( data => this.pantallaModeloCalidadData = data ) );
        this.sub.add( this.storeServicio.state$.subscribe( data => this.servicioData = data ) );

    }


    search( e: InputSearchComponentEventData<ElementoEconomico> )
    {
        if ( this.recursiveSearch === 0 ) {

            this.recursiveSearch = 1;
            e.sender.store.setState( this.storeProducto.getState() );
            e.sender.search( e.event );

        }
        else if ( this.recursiveSearch === 1 ) {

            this.productoData = e.data;
            this.recursiveSearch = 2;
            e.sender.store.setState( this.storePantallaModeloCalidad.getState() );
            e.sender.search( e.event );

        }
        else if ( this.recursiveSearch === 2 ) {

            this.pantallaModeloCalidadData = e.data;
            this.recursiveSearch = 3;
            e.sender.store.setState( this.storeServicio.getState() );
            e.sender.search( e.event );

        }
        else if ( this.recursiveSearch === 3 ) {

            this.servicioData = e.data;
            this.recursiveSearch = 0;
            e.sender.store.setState([]);

        }
    }


    selectItem( event: Event, item: ElementoEconomico )
    {
        this.onSelectItem.emit({
            event: event,
            sender: this,
            elementoEconomico: item
        });
    }


    close( e: Event )
    {
        this.modalService.close( this );
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.sub.unsubscribe();
    }

}


export type CollectionElementoEconomicoComponentEventData =
{
    event: Event,
    sender: CollectionElementoEconomicoComponent,
    elementoEconomico: ElementoEconomico
}