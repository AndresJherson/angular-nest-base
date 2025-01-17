import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteService } from './models/Personas/Cliente/cliente.service';
import { DocumentoIdentificacionService } from './models/Personas/documento-identificacion.service';
import { ElementoEconomicoService } from './models/ElementosEconomicos/elemento-economico.service';
import { ConectorService } from './services/conector.service';
import { GeneroService } from './models/Personas/genero.service';
import { UsuarioService } from './models/Personas/Usuario/usuario.service';
import { EmpleadoService } from './models/Personas/Empleado/empleado.service';
import { ServicioService } from './models/ElementosEconomicos/Servicio/servicio.service';
import { ProductoService } from './models/ElementosEconomicos/Bien/Producto/producto.service';
import { PantallaModeloCalidadService } from './models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo-calidad.service';
import { MovimientoEfectivoService } from './models/DocumentosMovimiento/MovimientoEfectivo/movimiento-efectivo.service';
import { MovimientoProductoService } from './models/DocumentosMovimiento/MovimientoProducto/movimiento-producto.service';
import { MovimientoPantallaService } from './models/DocumentosMovimiento/MovimientoPantalla/movimiento-pantalla.service';
import { NotaVentaService } from './models/DocumentosTransaccion/NotaVenta/nota-venta.service';
import { NotaService } from './models/DocumentosTransaccion/nota.service';
import { CreditoCobrarService } from './models/DocumentosTransaccion/CreditoCobrar/credito-cobrar.service';
import { BienMarcaService } from './models/ElementosEconomicos/Bien/bien-marca.service';
import { BienCategoriaService } from './models/ElementosEconomicos/Bien/bien-categoria.service';
import { MagnitudService } from './models/ElementosEconomicos/Bien/magnitud.service';
import { MagnitudTipoService } from './models/ElementosEconomicos/Bien/magnitud-tipo.service';
import { ServicioCategoriaService } from './models/ElementosEconomicos/Servicio/servicio-categoria.service';
import { PantallaMarcaService } from './models/ElementosEconomicos/Bien/Pantalla/pantalla-marca.service';
import { PantallaModeloService } from './models/ElementosEconomicos/Bien/Pantalla/pantalla-modelo.service';
import { CalidadService } from './models/ElementosEconomicos/Bien/Pantalla/calidad.service';
import { DocumentoMovimientoService } from './models/DocumentosMovimiento/documento-movimiento.service';
import { MedioTransferenciaService } from './models/DocumentosMovimiento/medio-transferencia.service';
import { SessionService } from './services/session.service';
import { DocumentoTransaccionService } from './models/DocumentosTransaccion/documento-transaccion.service';
import { KardexService } from './models/ElementosEconomicos/Bien/Inventario/kardex.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    ClienteService,
    DocumentoIdentificacionService,
    ElementoEconomicoService,
    ConectorService,
    GeneroService,
    UsuarioService,
    EmpleadoService,
    ServicioService,
    ProductoService,
    PantallaModeloCalidadService,
    MovimientoEfectivoService,
    MovimientoProductoService,
    MovimientoPantallaService,
    NotaVentaService,
    NotaService,
    CreditoCobrarService,
    BienMarcaService,
    BienCategoriaService,
    MagnitudService,
    MagnitudTipoService,
    ServicioCategoriaService,
    PantallaMarcaService,
    PantallaModeloService,
    CalidadService,
    DocumentoMovimientoService,
    MedioTransferenciaService,
    SessionService,
    DocumentoTransaccionService,
    KardexService,
  ],
})
export class AppModule {}
