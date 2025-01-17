import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayDirective, OverlayService } from './services/overlay.service';
import { NgClass } from '@angular/common';
import { DataBaseComponent } from './views/Pages/DataBase/DataBase.component';
import { NotaVentaService } from './models/DocumentosTransaccion/NotaVenta/nota-venta.service';
import { ProductoService } from './models/ElementosEconomicos/Bien/Producto/producto.service';
import { PantallaModeloCalidadService } from './models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo-calidad.service';
import { CollectionElementoEconomicoComponent } from './views/CollectionComponents/CollectionElementoEconomico/CollectionElementoEconomico.component';
import { ClienteService } from './models/Personas/Cliente/cliente.service';
import { ModalService } from './services/modal.service';
import { KardexComponent } from './views/ObjectComponents/ElementosEconomicos/Kardex/Kardex.component';

@Component({
  imports: [
    RouterModule,
    OverlayDirective,
    NgClass
],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    OverlayService
  ]
})
export class AppComponent {

    overlayService = inject( OverlayService );
    isActiveMenu = false;

    @ViewChild( 'menuHorizontal' ) menuHorizontal?: ElementRef<HTMLElement>;
    @ViewChild( 'menuVertical' ) menuVertical?: ElementRef<HTMLElement>;

    modalService = inject( ModalService );
    
    notaVentaService = inject( NotaVentaService );
    clienteService = inject( ClienteService );
    productoService = inject( ProductoService );
    pantallaModeloCalidadService = inject( PantallaModeloCalidadService );

    menuData: OptionAppComponent[] = [
        {
            title: 'Notas de Venta',
            onClick: app => this.notaVentaService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Clientes',
            onClick: app => this.clienteService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Productos',
            onClick: app => this.productoService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Pantallas',
            onClick: app => this.pantallaModeloCalidadService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Base de Datos',
            onClick: app => this.overlayService.open( DataBaseComponent ).subscribe( c => {
                c.overlayService = this.overlayService;
            } )
        },
        {
            title: 'Componente',
            onClick: app => this.overlayService.open( CollectionElementoEconomicoComponent ).subscribe()
        }
    ];

    private onClickWindow = ( e: Event ) => {
        if ( 
            !this.menuHorizontal?.nativeElement.contains( e.target as any ) &&
            !this.menuVertical?.nativeElement.contains( e.target as any )
        ) {
            this.isActiveMenu = false;
        }
    }


    ngOnInit()
    {
        // this.clickOption( this.menuData[4] )
        this.overlayService.open( KardexComponent ).subscribe();
    }
    
    ngAfterViewInit()
    {
        window.addEventListener( 'click', this.onClickWindow );

    }


    clickOption( option: OptionAppComponent )
    {
        this.overlayService.clear();
        this.isActiveMenu = false;
        option.onClick( this );
    }


    ngOnDestroy()
    {
        window.removeEventListener( 'click', this.onClickWindow );
        this.overlayService.clear();
    }
}


export interface OptionAppComponent
{
    title: string,
    onClick: ( app: AppComponent ) => void
}