import Decimal from "decimal.js";
import { Model, Prop, PropBehavior } from "../Model";
import { Carpeta } from "./Carpeta";
import { Establecimiento } from "../Personas/Establecimiento";
import { SalidaEfectivo } from "../DocumentosMovimiento/MovimientoEfectivo/SalidaEfectivo";
import { ErrorModel } from "../utils/ErrorModel";
import { DateTime } from 'luxon';
import { Nota } from "./Nota";
import { MovimientoEfectivo } from "../DocumentosMovimiento/MovimientoEfectivo/MovimientoEfectivo";
import { MovimientoProducto } from "../DocumentosMovimiento/MovimientoProducto/MovimientoProducto";
import { MovimientoPantalla } from "../DocumentosMovimiento/MovimientoPantalla/MovimientoPantalla";
import { EntradaEfectivo } from "../DocumentosMovimiento/MovimientoEfectivo/EntradaEfectivo";
import { Usuario } from "../Personas/Usuario/Usuario";

@Prop.Class()
export class DocumentoTransaccion extends Model
{
    @Prop.Set() uuid?: string;
    @Prop.Set() codigoSerie?: string;
    @Prop.Set() codigoNumero?: number;

    @Prop.Set( PropBehavior.datetime ) fechaCreacion?: string;
    @Prop.Set( PropBehavior.datetime ) fechaActualizacion?: string;
    @Prop.Set( PropBehavior.datetime ) fechaEmision?: string;
    @Prop.Set( PropBehavior.datetime ) fechaAnulacion?: string;

    @Prop.Set( PropBehavior.model, () => Usuario ) usuario?: Usuario;
    @Prop.Set( PropBehavior.model, () => Establecimiento ) establecimiento?: Establecimiento;
    @Prop.Set() concepto?: string;
    @Prop.Set( PropBehavior.model, () => Carpeta ) carpeta?: Carpeta;
    @Prop.Set() importeNeto: number = 0;

    @Prop.Set() importeCobrado: number = 0;
    @Prop.Set() importePorCobrar: number = 0;
    @Prop.Set() porcentajeCobrado: number = 0;
    @Prop.Set() porcentajePorCobrar: number = 0;

    @Prop.Set( PropBehavior.array, () => Nota ) notas: Nota[] = [];
    @Prop.Set( PropBehavior.array, () => MovimientoEfectivo ) movimientosEfectivo: MovimientoEfectivo[] = [];
    @Prop.Set( PropBehavior.array, () => MovimientoProducto ) movimientosProducto: MovimientoProducto[] = [];
    @Prop.Set( PropBehavior.array, () => MovimientoPantalla ) movimientosPantalla: MovimientoPantalla[] = [];

    @Prop.Set() type: string = DocumentoTransaccion.name;


    constructor( json?: Partial<DocumentoTransaccion> )
    {
        super();
        Prop.initialize( this, json );
    }


    agregarNota( nota: Nota ): this
    {
        nota.fechaCreacion = nota.fechaCreacion ?? Prop.toDateTimeNow().toSQL();
        this.notas.unshift( nota );
        return this;
    }


    eliminarNota( nota: Nota ): this
    {
        this.notas = this.notas.filter( n => n.symbol !== nota.symbol );
        this.notas = this.notas.filter( n =>
            ( n.id === undefined || nota.id === undefined )
            ? true
            : ( n.id === nota.id )
        );

        return this;
    }


    agregarMovimientoEfectivo( movimientoEfectivo: MovimientoEfectivo ): this
    {
        this.movimientosEfectivo.unshift( movimientoEfectivo );
        this.calcularInformacionMovimiento();
        return this;
    }


    actualizarMovimientoEfectivo( movimientoEfectivo: MovimientoEfectivo ): this
    {
        let i = this.movimientosEfectivo.findIndex( mov => mov.symbol === movimientoEfectivo.symbol );

        i = i === -1
            ? this.movimientosEfectivo.findIndex( mov => 
                ( mov.id === undefined || movimientoEfectivo.id === undefined )
                ? false
                : ( mov.id === movimientoEfectivo.id )
            )
            : i;

        if ( i !== -1 ) this.movimientosEfectivo[ i ] = movimientoEfectivo;

        return this;
    }


    eliminarMovimientoEfectivo( movimientoEfectivo: MovimientoEfectivo ): this
    {
        this.movimientosEfectivo = this.movimientosEfectivo.filter( mov => mov.symbol !== movimientoEfectivo.symbol );
        this.movimientosEfectivo = this.movimientosEfectivo.filter( mov => 
            ( mov.id === undefined || movimientoEfectivo === undefined )
            ? true
            : ( mov.id === movimientoEfectivo.id )
        )

        return this;
    }


    // ESTADOS

    borrador(): this
    {
        this.fechaCreacion = DateTime.local().toSQL();
        this.fechaActualizacion = DateTime.local().toSQL();
        return this;
    }

    emitir(): this
    {
        this.fechaCreacion = this.fechaCreacion ?? DateTime.local().toSQL();
        this.fechaEmision = this.fechaEmision ?? DateTime.local().toSQL();
        this.fechaActualizacion = DateTime.local().toSQL();
        return this;
    }


    anular(): this
    {
        this.fechaAnulacion = this.fechaAnulacion ?? DateTime.local().toSQL();
        this.fechaActualizacion = DateTime.local().toSQL();
        return this;
    }


    // CÁLCULOS

    calcularInformacion(): this
    {
        return this.calcularInformacionTransaccion()
                    .calcularInformacionMovimiento();
    }


    calcularInformacionTransaccion(): this
    {
        return this;
    }


    calcularInformacionMovimiento(): this
    {
        return this.calcularInformacionEfectivo()
                    .calcularInformacionPantalla()
                    .calcularInformacionProducto();
    }


    calcularInformacionEfectivo(): this
    {
        try {
        
            this.movimientosEfectivo.forEach( movEfectivo => {

                if ( movEfectivo instanceof EntradaEfectivo || movEfectivo.type === EntradaEfectivo.name ) {

                    this.importeCobrado = new Decimal( this.importeCobrado )
                                            .plus( movEfectivo.importeNeto ?? 0 )
                                            .toNumber();

                }
                else if ( movEfectivo instanceof SalidaEfectivo || movEfectivo.type === SalidaEfectivo.name ) {

                    this.importeCobrado = new Decimal( this.importeCobrado )
                                            .minus( movEfectivo.importeNeto ?? 0 )
                                            .toNumber();

                }

            } );

            this.importeCobrado = new Decimal( this.importeCobrado )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();

            this.importePorCobrar = new Decimal( this.importeNeto )
                                    .minus( this.importeCobrado )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();

            try {

                this.porcentajeCobrado = new Decimal( this.importeCobrado )
                                        .div( this.importeNeto )
                                        .toDecimalPlaces( 2 )
                                        .toNumber();
    
                this.porcentajePorCobrar = new Decimal( 100.00 )
                                        .minus( this.porcentajeCobrado )
                                        .toDecimalPlaces( 2 )
                                        .toNumber();
                
            }
            catch ( error ) {
                this.porcentajeCobrado = 0;
                this.porcentajePorCobrar = 0;
            }


        }
        catch ( error ) {
            throw new ErrorModel( 'Error al calcular movimientos de efectivo en Documento de Transacción', error );
        }

        return this;
    }


    calcularInformacionPantalla(): this
    {
        return this;
    }


    calcularInformacionProducto(): this
    {
        return this;
    }
}