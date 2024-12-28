import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from '../../../interfaces/IComponent';
import { Subscription } from 'rxjs';
import { GeneroService } from '../../../models/Personas/genero.service';
import { DocumentoIdentificacionService } from '../../../models/Personas/documento-identificacion.service';
import { ClienteService } from '../../../models/Personas/Cliente/cliente.service';
import { EmpleadoService } from '../../../models/Personas/Empleado/empleado.service';
import { UsuarioService } from '../../../models/Personas/Usuario/usuario.service';
import { OverlayService } from '../../../services/overlay.service';
import { MagnitudService } from '../../../models/ElementosEconomicos/Bien/magnitud.service';
import { BienCategoriaService } from '../../../models/ElementosEconomicos/Bien/bien-categoria.service';
import { MagnitudTipoService } from '../../../models/ElementosEconomicos/Bien/magnitud-tipo.service';
import { BienMarcaService } from '../../../models/ElementosEconomicos/Bien/bien-marca.service';
import { ProductoService } from '../../../models/ElementosEconomicos/Bien/Producto/producto.service';
import { PantallaModeloService } from '../../../models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo.service';
import { PantallaMarcaService } from '../../../models/ElementosEconomicos/Bien/Pantalla/pantalla-marca.service';
import { CalidadService } from '../../../models/ElementosEconomicos/Bien/Pantalla/calidad.service';
import { PantallaModeloCalidadService } from '../../../models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo-calidad.service';
import { ServicioCategoriaService } from '../../../models/ElementosEconomicos/Servicio/servicio-categoria.service';
import { ServicioService } from '../../../models/ElementosEconomicos/Servicio/servicio.service';

@Component({
  selector: 'app-data-base',
  imports: [CommonModule],
  templateUrl: './DataBase.component.html',
  styleUrl: './DataBase.component.css',
})
export class DataBaseComponent implements IComponent<DataBaseComponent> {

    @Input() overlayService = new OverlayService();

    @Output() readonly onInit = new EventEmitter<DataBaseComponent>();
    @Output() readonly onDestroy = new EventEmitter<DataBaseComponent>();
    sub: Subscription = new Subscription();

    generoService = inject( GeneroService );
    documentoIdentificacionService = inject( DocumentoIdentificacionService );
    usuarioService = inject( UsuarioService );
    empleadoService = inject( EmpleadoService );
    clienteService = inject( ClienteService);

    tablesPersona: TableDataBaseComponent[] = [
        {
            title: 'Usuarios',
            onClick: dbc => this.usuarioService.openTableComponent( this.overlayService ).subscribe(),
            principal: true
        },
        {
            title: 'Empleados',
            onClick: dbc => this.empleadoService.openTableComponent( this.overlayService ).subscribe(),
            principal: true
        },
        {
            title: 'Clientes',
            onClick: dbc => this.clienteService.openTableComponent( this.overlayService ).subscribe(),
            principal: true
        },
        {
            title: 'Documentos Identificación',
            onClick: dbc => this.documentoIdentificacionService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Géneros',
            onClick: dbc => this.generoService.openTableComponent( this.overlayService ).subscribe()
        },
    ]


    pantallaMarcaService = inject( PantallaMarcaService );
    pantallaModeloService = inject( PantallaModeloService );
    calidadService = inject( CalidadService );
    pantallaModeloCalidadService = inject( PantallaModeloCalidadService );

    tablesPantalla: TableDataBaseComponent[] = [
        {
            title: 'Marcas de Pantalla',
            onClick: dbc => this.pantallaMarcaService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Modelos de Pantalla',
            onClick: dbc => this.pantallaModeloService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Calidades de Pantalla',
            onClick: dbc => this.calidadService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Pantallas',
            onClick: dbc => this.pantallaModeloCalidadService.openTableComponent( this.overlayService ).subscribe(),
            principal: true
        },
    ];


    productoService = inject( ProductoService );
    magnitudService = inject( MagnitudService );
    magnitudTipoService = inject( MagnitudTipoService );
    bienCategoriaService = inject( BienCategoriaService );
    bienMarcaService = inject( BienMarcaService );

    tablesBien: TableDataBaseComponent[] = [
        {
            title: 'Productos',
            onClick: dbc => this.productoService.openTableComponent( this.overlayService ).subscribe(),
            principal: true
        },
        {
            title: 'Marcas de Producto',
            onClick: dbc => this.bienMarcaService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Categorias de Producto',
            onClick: dbc => this.bienCategoriaService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Magnitudes',
            onClick: dbc => this.magnitudService.openTableComponent( this.overlayService ).subscribe()
        },
        {
            title: 'Tipos de Magnitud',
            onClick: dbc => this.magnitudTipoService.openTableComponent( this.overlayService ).subscribe()
        },
    ];


    servicioService = inject( ServicioService );
    servicioCategoriaService = inject( ServicioCategoriaService );

    tablesServicio: TableDataBaseComponent[] = [
        {
            title: 'Servicios',
            onClick: dbc => this.servicioService.openTableComponent( this.overlayService ).subscribe(),
            principal: true
        },
        {
            title: 'Categorias de Servicio',
            onClick: dbc => this.servicioCategoriaService.openTableComponent( this.overlayService ).subscribe()
        },
    ];


    ngOnInit(): void 
    {
        this.onInit.emit( this );
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.sub.unsubscribe();
        this.overlayService.clear();
    }
}


export interface TableDataBaseComponent
{
    title: string;
    onClick: ( dbcomponent: DataBaseComponent ) => void,
    principal?: boolean
}