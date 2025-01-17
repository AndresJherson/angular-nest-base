import Decimal from "decimal.js";
import { Model, Prop, PropBehavior, Carpeta,
Establecimiento,
SalidaEfectivo,
Nota,
MovimientoEfectivo,
MovimientoProducto,
MovimientoPantalla,
EntradaEfectivo,
Usuario,
EntradaPantalla,
SalidaPantalla,
EntradaProducto,
SalidaProducto } from '../../index';
import { DateTime } from "luxon";
import { ErrorModel } from "../utils/ErrorModel";

@Prop.Class()
export class DocumentoTransaccion extends Model
{
    static override type = 'DocumentoTransaccion';
    @Prop.Set() type: string = DocumentoTransaccion.type;

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



    constructor( json?: Partial<DocumentoTransaccion> )
    {
        super();
        Prop.initialize( this, json );
    }


    static initialize( data: Partial<DocumentoTransaccion>[] ): DocumentoTransaccion[]
    {
        return data.map( item => 
            new (
                Prop.GetClass<DocumentoTransaccion>( item.type )
                ?? Prop.GetClass( Object.getPrototypeOf( item ) )
                ?? DocumentoTransaccion
            )( item )
        )
    }


    // Notas

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
            : ( n.id !== nota.id )
        );

        return this;
    }


    // Movimientos de Efectivo

    agregarMovimientoEfectivo( movimientoEfectivo: MovimientoEfectivo ): this
    {
        this.movimientosEfectivo.push( movimientoEfectivo.set({
            fechaEmision: movimientoEfectivo.fechaEmision ?? this.fechaEmision,
            fechaAnulacion: movimientoEfectivo.fechaAnulacion ?? this.fechaAnulacion
        }) );
        this.procesarInformacionMovimiento();
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

        if ( i !== -1 ) {
            this.movimientosEfectivo[ i ] = movimientoEfectivo;
            this.procesarInformacionMovimiento();
        }

        return this;
    }


    eliminarMovimientoEfectivo( movimientoEfectivo: MovimientoEfectivo ): this
    {
        this.movimientosEfectivo = this.movimientosEfectivo.filter( mov => mov.symbol !== movimientoEfectivo.symbol );
        this.movimientosEfectivo = this.movimientosEfectivo.filter( mov => 
            ( mov.id === undefined || movimientoEfectivo.id === undefined )
                ? true
                : ( mov.id !== movimientoEfectivo.id )
        )

        this.procesarInformacionMovimiento();

        return this;
    }


    getMovimientoEfectivo( movimientoEfectivo: MovimientoEfectivo ): MovimientoEfectivo
    {
        let i = this.movimientosEfectivo.findIndex( mov => mov.symbol === movimientoEfectivo.symbol );

        i = i === -1
            ? this.movimientosEfectivo.findIndex( mov => 
                ( mov.id === undefined || movimientoEfectivo.id === undefined )
                    ? false
                    : ( mov.id === movimientoEfectivo.id )
            )
            : i;

        if ( i !== -1 ) {
            return this.movimientosEfectivo[ i ];
        }
        else {
            throw new ErrorModel( 'Movimiento de efectivo no existe' );
        }
    }


    // Movimientos de Pantalla

    agregarMovimientoPantalla( movimientoPantalla: MovimientoPantalla ): this
    {
        this.movimientosPantalla.push( movimientoPantalla.set({
            fechaEmision: movimientoPantalla.fechaEmision ?? this.fechaEmision,
            fechaAnulacion: movimientoPantalla.fechaAnulacion ?? this.fechaAnulacion
        }) );
        this.procesarInformacionMovimiento();
        return this;
    }


    actualizarMovimientoPantalla( movimientoPantalla: MovimientoPantalla ): this
    {
        let i = this.movimientosPantalla.findIndex( mov => mov.symbol === movimientoPantalla.symbol );

        i = i === -1
            ? this.movimientosPantalla.findIndex( mov => 
                ( mov.id === undefined || movimientoPantalla.id === undefined )
                ? false
                : ( mov.id === movimientoPantalla.id )
            )
            : i;

        if ( i !== -1 ) {
            this.movimientosPantalla[ i ] = movimientoPantalla;
            this.procesarInformacionMovimiento();
        }

        return this;
    }


    eliminarMovimientoPantalla( movimientoPantalla: MovimientoPantalla ): this
    {
        this.movimientosPantalla = this.movimientosPantalla.filter( mov => mov.symbol !== movimientoPantalla.symbol );
        this.movimientosPantalla = this.movimientosPantalla.filter( mov => 
            ( mov.id === undefined || movimientoPantalla.id === undefined )
            ? true
            : ( mov.id !== movimientoPantalla.id )
        )
        
        this.procesarInformacionMovimiento();

        return this;
    }


    getMovimientoPantalla( movimientoPantalla: MovimientoPantalla ): MovimientoPantalla
    {
        let i = this.movimientosPantalla.findIndex( mov => mov.symbol === movimientoPantalla.symbol );

        i = i === -1
            ? this.movimientosPantalla.findIndex( mov => 
                ( mov.id === undefined || movimientoPantalla.id === undefined )
                    ? false
                    : ( mov.id === movimientoPantalla.id )
            )
            : i;

        if ( i !== -1 ) {
            return this.movimientosPantalla[ i ];
        }
        else {
            throw new ErrorModel( 'Movimiento de Pantalla no existe' );
        }
    }



    // Movimientos de Productos

    agregarMovimientoProducto( movimientoProducto: MovimientoProducto ): this
    {
        this.movimientosProducto.push( movimientoProducto.set({
            fechaEmision: movimientoProducto.fechaEmision ?? this.fechaEmision,
            fechaAnulacion: movimientoProducto.fechaAnulacion ?? this.fechaAnulacion
        }) );
        this.procesarInformacionMovimiento();
        return this;
    }
    

    actualizarMovimientoProducto( movimientoProducto: MovimientoProducto ): this
    {
        let i = this.movimientosProducto.findIndex( mov => mov.symbol === movimientoProducto.symbol );

        i = i === -1
            ? this.movimientosProducto.findIndex( mov => 
                ( mov.id === undefined || movimientoProducto.id === undefined )
                ? false
                : ( mov.id === movimientoProducto.id )
            )
            : i;

        if ( i !== -1 ) {
            this.movimientosProducto[ i ] = movimientoProducto;
            this.procesarInformacionMovimiento();
        }

        return this;
    }


    eliminarMovimientoProducto( movimientoProducto: MovimientoProducto ): this
    {
        this.movimientosProducto = this.movimientosProducto.filter( mov => mov.symbol !== movimientoProducto.symbol );
        this.movimientosProducto = this.movimientosProducto.filter( mov => 
            ( mov.id === undefined || movimientoProducto.id === undefined )
            ? true
            : ( mov.id !== movimientoProducto.id )
        )

        this.procesarInformacionMovimiento();

        return this;
    }


    getMovimientoProducto( movimientoProducto: MovimientoProducto ): MovimientoProducto
    {
        let i = this.movimientosProducto.findIndex( mov => mov.symbol === movimientoProducto.symbol );

        i = i === -1
            ? this.movimientosProducto.findIndex( mov => 
                ( mov.id === undefined || movimientoProducto.id === undefined )
                    ? false
                    : ( mov.id === movimientoProducto.id )
            )
            : i;

        if ( i !== -1 ) {
            return this.movimientosProducto[ i ];
        }
        else {
            throw new ErrorModel( 'Movimiento de Producto no existe' );
        }
    }
    

    // Estados

    crearBorrador(): this
    {
        this.fechaCreacion = DateTime.local().toSQL();
        this.fechaActualizacion = DateTime.local().toSQL();
        return this;
    }


    actualizarBorrador(): this
    {
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

    procesarInformacion(): this
    {
        return this.procesarInformacionTransaccion()
                    .procesarInformacionMovimiento();
    }


    procesarInformacionTransaccion(): this
    {
        const dateTimeFechaEmision = Prop.toDateTime( this.fechaEmision );
        const dateTimeFechaAnulacion = Prop.toDateTime( this.fechaAnulacion );

        this.fechaEmision = !dateTimeFechaEmision.isValid && dateTimeFechaAnulacion.isValid
                                ? dateTimeFechaAnulacion.toSQL()
                            : ( dateTimeFechaEmision.isValid && dateTimeFechaAnulacion.isValid ) && 
                            dateTimeFechaEmision > dateTimeFechaAnulacion
                                ? dateTimeFechaAnulacion.toSQL()
                                : this.fechaEmision;
        
        return this;
    }


    procesarInformacionMovimiento(): this
    {
        return this.procesarInformacionEfectivo()
                    .procesarInformacionPantalla()
                    .procesarInformacionProducto();
    }


    procesarInformacionEfectivo(): this
    {
        try {

            const dateTimeFechaAnulacionTransaccion = Prop.toDateTime( this.fechaAnulacion );
            const dateTimeFechaEmisionTransaccion = Prop.toDateTime( this.fechaEmision );

            if ( !dateTimeFechaEmisionTransaccion.isValid ) {
                this.movimientosEfectivo = [];
            }

        
            this.movimientosEfectivo.forEach( movEfectivo => {

                const dateTimeFechaEmisionMovimiento = Prop.toDateTime( movEfectivo.fechaEmision );
                const dateTimeFechaAnulacionMovimiento = Prop.toDateTime( movEfectivo.fechaAnulacion );

                movEfectivo.set({
                    fechaAnulacion: !dateTimeFechaEmisionTransaccion.isValid
                                        ? undefined
                                    : ( dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaAnulacionMovimiento.isValid ) &&
                                    ( dateTimeFechaAnulacionMovimiento >= dateTimeFechaEmisionTransaccion ) && 
                                    ( dateTimeFechaAnulacionMovimiento <= dateTimeFechaAnulacionTransaccion )
                                        ? dateTimeFechaAnulacionMovimiento.toSQL()
                                    : ( !dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaAnulacionMovimiento.isValid ) &&
                                    ( dateTimeFechaAnulacionMovimiento >= dateTimeFechaEmisionTransaccion )
                                        ? dateTimeFechaAnulacionMovimiento.toSQL()
                                    : dateTimeFechaAnulacionTransaccion.isValid
                                        ? dateTimeFechaAnulacionTransaccion.toSQL()
                                        : undefined,
                    fechaEmision: !dateTimeFechaEmisionTransaccion.isValid
                                    ? undefined
                                : ( dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaEmisionMovimiento.isValid ) &&
                                ( dateTimeFechaEmisionMovimiento >= dateTimeFechaEmisionTransaccion ) && 
                                ( dateTimeFechaEmisionMovimiento <= dateTimeFechaAnulacionTransaccion )
                                    ? dateTimeFechaEmisionMovimiento.toSQL()
                                : ( !dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaEmisionMovimiento.isValid ) &&
                                ( dateTimeFechaEmisionMovimiento >= dateTimeFechaEmisionTransaccion )
                                    ? dateTimeFechaEmisionMovimiento.toSQL()
                                    : dateTimeFechaEmisionTransaccion.toSQL(),
                }).procesarInformacionMovimiento();

            } );


            this.movimientosEfectivo.filter( mov => mov.fechaAnulacion === undefined )
            .forEach( movEfectivo => {

                if ( movEfectivo instanceof EntradaEfectivo || movEfectivo.type === EntradaEfectivo.prototype.constructor.name ) {

                    this.importeCobrado = new Decimal( this.importeCobrado )
                                            .plus( movEfectivo.importeNeto ?? 0 )
                                            .toNumber();

                }
                else if ( movEfectivo instanceof SalidaEfectivo || movEfectivo.type === SalidaEfectivo.prototype.constructor.name ) {

                    this.importeCobrado = new Decimal( this.importeCobrado )
                                            .minus( movEfectivo.importeNeto ?? 0 )
                                            .toNumber();

                }

            } )

            this.importeCobrado = new Decimal( this.importeCobrado )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();

            this.importePorCobrar =
                this.importeNeto <= 0
                    ? 0
                    : new Decimal( this.importeNeto )
                        .minus( this.importeCobrado )
                        .toDecimalPlaces( 2 )
                        .toNumber();

            try {

                this.porcentajeCobrado = 
                    this.importeNeto <= 0
                        ? 0
                        : new Decimal( this.importeCobrado )
                            .div( this.importeNeto )
                            .mul( 100.00 )
                            .toDecimalPlaces( 2 )
                            .toNumber();
    
                this.porcentajePorCobrar =
                    this.importeNeto <= 0
                        ? 0
                        : new Decimal( 100.00 )
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
            throw new ErrorModel( 'Error al procesar movimientos de efectivo en Documento de Transacción', error );
        }

        return this;
    }


    procesarInformacionPantalla(): this
    {
        try {
        
            const dateTimeFechaAnulacionTransaccion = Prop.toDateTime( this.fechaAnulacion );
            const dateTimeFechaEmisionTransaccion = Prop.toDateTime( this.fechaEmision );

            if ( !dateTimeFechaEmisionTransaccion.isValid ) {
                this.movimientosPantalla = [];
            }


            this.movimientosPantalla.forEach( movPantalla => {

                const dateTimeFechaEmisionMovimiento = Prop.toDateTime( movPantalla.fechaEmision );
                const dateTimeFechaAnulacionMovimiento = Prop.toDateTime( movPantalla.fechaAnulacion );


                movPantalla.set({
                    fechaAnulacion: !dateTimeFechaEmisionTransaccion.isValid
                                        ? undefined
                                    : ( dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaAnulacionMovimiento.isValid ) &&
                                    ( dateTimeFechaAnulacionMovimiento >= dateTimeFechaEmisionTransaccion ) && 
                                    ( dateTimeFechaAnulacionMovimiento <= dateTimeFechaAnulacionTransaccion )
                                        ? dateTimeFechaAnulacionMovimiento.toSQL()
                                    : ( !dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaAnulacionMovimiento.isValid ) &&
                                    ( dateTimeFechaAnulacionMovimiento >= dateTimeFechaEmisionTransaccion )
                                        ? dateTimeFechaAnulacionMovimiento.toSQL()
                                    : dateTimeFechaAnulacionTransaccion.isValid
                                        ? dateTimeFechaAnulacionTransaccion.toSQL()
                                        : undefined,
                    fechaEmision: !dateTimeFechaEmisionTransaccion.isValid
                                    ? undefined
                                : ( dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaEmisionMovimiento.isValid ) &&
                                ( dateTimeFechaEmisionMovimiento >= dateTimeFechaEmisionTransaccion ) && 
                                ( dateTimeFechaEmisionMovimiento <= dateTimeFechaAnulacionTransaccion )
                                    ? dateTimeFechaEmisionMovimiento.toSQL()
                                : ( !dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaEmisionMovimiento.isValid ) &&
                                ( dateTimeFechaEmisionMovimiento >= dateTimeFechaEmisionTransaccion )
                                    ? dateTimeFechaEmisionMovimiento.toSQL()
                                    : dateTimeFechaEmisionTransaccion.toSQL(),
                }).procesarInformacionMovimiento();

            } );


        }
        catch ( error ) {
            throw new ErrorModel( 'Error al procesar movimientos de pantallas en Documento de Transacción', error );
        }

        return this;
    }


    procesarInformacionProducto(): this
    {
        try {

            const dateTimeFechaAnulacionTransaccion = Prop.toDateTime( this.fechaAnulacion );
            const dateTimeFechaEmisionTransaccion = Prop.toDateTime( this.fechaEmision );

            if ( !dateTimeFechaEmisionTransaccion.isValid ) {
                this.movimientosProducto = [];
            }


            this.movimientosProducto.forEach( movProducto => {

                const dateTimeFechaEmisionMovimiento = Prop.toDateTime( movProducto.fechaEmision );
                const dateTimeFechaAnulacionMovimiento = Prop.toDateTime( movProducto.fechaAnulacion );


                movProducto.set({
                    fechaAnulacion: !dateTimeFechaEmisionTransaccion.isValid
                                        ? undefined
                                    : ( dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaAnulacionMovimiento.isValid ) &&
                                    ( dateTimeFechaAnulacionMovimiento >= dateTimeFechaEmisionTransaccion ) && 
                                    ( dateTimeFechaAnulacionMovimiento <= dateTimeFechaAnulacionTransaccion )
                                        ? dateTimeFechaAnulacionMovimiento.toSQL()
                                    : ( !dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaAnulacionMovimiento.isValid ) &&
                                    ( dateTimeFechaAnulacionMovimiento >= dateTimeFechaEmisionTransaccion )
                                        ? dateTimeFechaAnulacionMovimiento.toSQL()
                                    : dateTimeFechaAnulacionTransaccion.isValid
                                        ? dateTimeFechaAnulacionTransaccion.toSQL()
                                        : undefined,
                    fechaEmision: !dateTimeFechaEmisionTransaccion.isValid
                                    ? undefined
                                : ( dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaEmisionMovimiento.isValid ) &&
                                ( dateTimeFechaEmisionMovimiento >= dateTimeFechaEmisionTransaccion ) && 
                                ( dateTimeFechaEmisionMovimiento <= dateTimeFechaAnulacionTransaccion )
                                    ? dateTimeFechaEmisionMovimiento.toSQL()
                                : ( !dateTimeFechaAnulacionTransaccion.isValid && dateTimeFechaEmisionMovimiento.isValid ) &&
                                ( dateTimeFechaEmisionMovimiento >= dateTimeFechaEmisionTransaccion )
                                    ? dateTimeFechaEmisionMovimiento.toSQL()
                                    : dateTimeFechaEmisionTransaccion.toSQL(),
                }).procesarInformacionMovimiento();

            } );

        }
        catch ( error ) {
            throw new ErrorModel( 'Error al procesar movimientos de productos en Documento de Transacción', error );
        }

        return this;
    }
}