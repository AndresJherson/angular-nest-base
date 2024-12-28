import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayDirective, OverlayService } from './services/overlay.service';
import { NgClass } from '@angular/common';
import { GeneroService } from './models/Personas/genero.service';
import { DataBaseComponent } from './views/Pages/DataBase/DataBase.component';
import { ObjectComponent } from "./views/ObjectComponents/Object/Object.component";
import { NotaVentaService } from './models/DocumentosTransaccion/NotaVenta/nota-venta.service';

@Component({
  imports: [
    RouterModule,
    OverlayDirective,
    NgClass,
    ObjectComponent
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
    isActiveMenu = true;

    @ViewChild( 'menuHorizontal' ) menuHorizontal?: ElementRef<HTMLElement>;
    @ViewChild( 'menuVertical' ) menuVertical?: ElementRef<HTMLElement>;

    generoService = inject( GeneroService );
    notaVentaService = inject( NotaVentaService );


    menuData: OptionAppComponent[] = [
        {
            title: 'Nota de Venta',
            onClick: app => this.notaVentaService.openNotaVentaComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Productos',
            onClick: app => {}
        },
        {
            title: 'Pantallas',
            onClick: app => {}
        },
        {
            title: 'Base de Datos',
            onClick: app => this.overlayService.open( DataBaseComponent ).subscribe( c => {
                c.overlayService = this.overlayService;
            } )
        },
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
        // this.generoService.tableComponent( this.overlayService ).subscribe();
        this.clickOption( this.menuData[3] );
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