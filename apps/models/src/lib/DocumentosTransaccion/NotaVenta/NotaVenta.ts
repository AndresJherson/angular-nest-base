import Decimal from "decimal.js";
import { Cliente, DocumentoIdentificacion, DocumentoTransaccion, EntradaPantalla, EntradaPantallaDetalle, EntradaProducto, EntradaProductoDetalle, LiquidacionTipo, NotaVentaCredito, NotaVentaDetalle, Prop, PropBehavior, SalidaPantalla, SalidaPantallaDetalle, SalidaProducto, SalidaProductoDetalle } from '../../../index';
import { ErrorModel } from "../../utils/ErrorModel";

@Prop.Class()
export class NotaVenta extends DocumentoTransaccion
{
    static override type = 'NotaVenta';
    @Prop.Set() override type: string = NotaVenta.type;

    @Prop.Set( PropBehavior.model, () => Cliente ) cliente?: Cliente;
    @Prop.Set( PropBehavior.model, () => DocumentoIdentificacion ) receptorDocumentoIdentificacion?: DocumentoIdentificacion;
    @Prop.Set() receptorCodigo?: string;
    @Prop.Set() receptorNombre?: string;
    @Prop.Set() receptorCelular?: number;

    @Prop.Set( PropBehavior.model, () => LiquidacionTipo ) liquidacionTipo?: LiquidacionTipo;
    @Prop.Set() importeBruto: number = 0;
    @Prop.Set() importeDescuento: number = 0;
    @Prop.Set() importeAnticipo: number = 0;
    @Prop.Set() override importeNeto: number = 0;
    
    @Prop.Set( PropBehavior.array, () => NotaVentaDetalle ) detalles: NotaVentaDetalle[] = [];
    @Prop.Set( PropBehavior.model, () => NotaVentaCredito ) credito: NotaVentaCredito = new NotaVentaCredito();


    constructor( json?: Partial<NotaVenta> )
    {
        super();
        Prop.initialize( this, json );

        this.presetCredito();
    }


    private presetCredito()
    {

        let importeNeto = this.importeNeto;
        Object.defineProperty( this, "importeNeto", {
            get: () => importeNeto,
            set( value: number ) {
                importeNeto = value;
                this.credito.importeCapitalInicial = value;
            },
        } );

        Object.defineProperty( this.credito, "importeCapitalInicial", {
            get: () => importeNeto,
            set( value: number ) {}
        } );


        let uuid = this.uuid;
        Object.defineProperty( this, "uuid", {
            get: () => uuid,
            set( value: string | undefined ) {
                uuid = value;
                this.credito.uuid = value;
            },
        } );

        Object.defineProperty( this.credito, "uuid", {
            get: () => uuid,
            set( value: string | undefined ) {}
        } );


        let codigoSerie = this.codigoSerie;
        Object.defineProperty( this, "codigoSerie", {
            get: () => codigoSerie,
            set( value: string | undefined ) {
                codigoSerie = value;
                this.credito.codigoSerie = value;
            },
        } );

        Object.defineProperty( this.credito, "codigoSerie", {
            get: () => codigoSerie,
            set( value: string | undefined ) {}
        } );


        let codigoNumero = this.codigoNumero;
        Object.defineProperty( this, "codigoNumero", {
            get: () => codigoNumero,
            set( value: number | undefined ) {
                codigoNumero = value;
                this.credito.codigoNumero = value;
            },
        } );

        Object.defineProperty( this.credito, "codigoNumero", {
            get: () => codigoNumero,
            set( value: number | undefined ) {}
        } );
    }

    
    override set(item: Partial<NotaVenta>): this 
    {
        return super.set(item as Partial<this>);
    }

    
    override setRelation( keys?: {
        id: number,
        notaId: number,
        detalleId: number,
        creditoId: number,
        cuotaId: number,
        documentoMovimientoId: number,
        entradaPantallaDetalleId: number,
        salidaPantallaDetalleId: number,
        entradaProductoDetalleId: number,
        salidaProductoDetalleId: number
    } ): this 
    {

        this.set({
            id: keys?.id ?? this.id
        })
        if ( keys ) keys.id++;

        
        this.notas.forEach( nota => {

            nota.set({
                id: keys?.notaId ?? nota.id,
                documentoTransaccion: new NotaVenta({ id: this.id, uuid: this.uuid, symbol: this.symbol, codigoSerie: this.codigoSerie, codigoNumero: this.codigoNumero })
            })

            if ( keys ) keys.notaId++;

        } )


        this.detalles.forEach( detalle => {

            detalle.set({
                id: keys?.detalleId ?? detalle.id,
                notaVenta: new NotaVenta({ id: this.id, uuid: this.uuid, symbol: this.symbol, codigoSerie: this.codigoSerie, codigoNumero: this.codigoNumero })
            });

            if ( keys ) keys.detalleId++;

        } )
        
        
        this.credito.set({
            id: keys?.creditoId ?? this.credito.id,
            uuid: this.uuid,
            codigoSerie: this.codigoSerie,
            codigoNumero: this.codigoNumero,
            documentoTransaccion: new NotaVenta({ id: this.id, uuid: this.uuid, symbol: this.symbol, codigoSerie: this.codigoSerie, codigoNumero: this.codigoNumero }),
            cuotas: this.credito.cuotas.map( cuota => {

                cuota.set({
                    id: keys?.cuotaId ?? cuota.id,
                    credito: new NotaVentaCredito({ id: keys?.creditoId ?? this.credito.id, uuid: this.uuid, symbol: this.credito.symbol, codigoSerie: this.codigoSerie, codigoNumero: this.codigoNumero })
                })

                if ( keys ) keys.cuotaId++;

                return cuota;

            } )
        });
        if ( keys ) keys.creditoId++;

        
        this.movimientosEfectivo.forEach( movEfectivo => {

            movEfectivo.set({
                id: keys?.documentoMovimientoId ?? movEfectivo.id,
                documentoTransaccion: new NotaVenta({ id: this.id, uuid: this.uuid, symbol: this.symbol, codigoSerie: this.codigoSerie, codigoNumero: this.codigoNumero })
            })

            if ( keys ) keys.documentoMovimientoId++;

        } )


        this.movimientosPantalla.forEach( movPantalla => {

            movPantalla.set({
                id: keys?.documentoMovimientoId ?? movPantalla.id,
                documentoTransaccion: new NotaVenta({ id: this.id, uuid: this.uuid, symbol: this.symbol, codigoSerie: this.codigoSerie, codigoNumero: this.codigoNumero }),
                detalles: movPantalla.detalles.map( detalle => {

                    if ( detalle instanceof EntradaPantallaDetalle ) {

                        detalle.set({
                            id: keys?.entradaPantallaDetalleId ?? detalle.id,
                            documentoMovimiento: new EntradaPantalla({ id: keys?.documentoMovimientoId ?? movPantalla.id, uuid: movPantalla.uuid, symbol: movPantalla.symbol, codigo: movPantalla.codigo })
                        })

                        if ( keys ) keys.entradaPantallaDetalleId++;

                    }
                    else if ( detalle instanceof SalidaPantallaDetalle ) {

                        detalle.set({
                            id: keys?.salidaPantallaDetalleId ?? detalle.id,
                            documentoMovimiento: new SalidaPantalla({ id: keys?.documentoMovimientoId ?? movPantalla.id, uuid: movPantalla.uuid, symbol: movPantalla.symbol, codigo: movPantalla.codigo })
                        })

                        if ( keys ) keys.salidaPantallaDetalleId++;

                    }

                    return detalle;

                } )
            })

            if ( keys ) keys.documentoMovimientoId++;

        } );


        this.movimientosProducto.forEach( movProducto => {

            movProducto.set({
                id: keys?.documentoMovimientoId ?? movProducto.id,
                documentoTransaccion: new NotaVenta({ id: this.id, uuid: this.uuid, symbol: this.symbol, codigoSerie: this.codigoSerie, codigoNumero: this.codigoNumero }),
                detalles: movProducto.detalles.map( detalle => {

                    if ( detalle instanceof EntradaProductoDetalle ) {

                        detalle.set({
                            id: keys?.entradaProductoDetalleId ?? detalle.id,
                            documentoMovimiento: new EntradaProducto({ id: keys?.documentoMovimientoId ?? movProducto.id, uuid: movProducto.uuid, symbol: movProducto.symbol, codigo: movProducto.codigo })
                        })

                        if ( keys ) keys.entradaProductoDetalleId++;

                    }
                    else if ( detalle instanceof SalidaProductoDetalle ) {

                        detalle.set({
                            id: keys?.salidaProductoDetalleId ?? detalle.id,
                            documentoMovimiento: new SalidaProducto({ id: keys?.documentoMovimientoId ?? movProducto.id, uuid: movProducto.uuid, symbol: movProducto.symbol, codigo: movProducto.codigo })
                        });

                        if ( keys ) keys.salidaProductoDetalleId++;

                    }

                    return detalle;

                } )
            })

            if ( keys ) keys.documentoMovimientoId++;

        } );


        return this;
    }


    // Detalles
    agregarDetalle( detalle: NotaVentaDetalle ): this
    {
        this.detalles.unshift( detalle );
        this.procesarInformacionTransaccion();
        return this;
    }


    actualizarDetalle( detalle: NotaVentaDetalle ): this
    {
        let i = this.detalles.findIndex( d => d.symbol === detalle.symbol );

        i = i === -1
            ? this.detalles.findIndex( d => 
                ( d.id === undefined || detalle.id === undefined )
                    ? false
                    : ( d.id === detalle.id )
            )
            : i;

        if ( i !== -1 ) {
            this.detalles[ i ] = detalle;
            this.procesarInformacionTransaccion();
        }
        return this;
    }


    eliminarDetalle( detalle: NotaVentaDetalle ): this
    {
        this.detalles = this.detalles.filter( d => d.symbol !== detalle.symbol );
        this.detalles = this.detalles.filter( d => 
            ( d.id === undefined || detalle.id === undefined )
                ? true
                : ( d.id !== detalle.id )
        );

        this.procesarInformacionTransaccion();

        return this;
    }


    getDetalle( detalle: NotaVentaDetalle ): NotaVentaDetalle
    {
        let i = this.detalles.findIndex( d => d.symbol === detalle.symbol );

        i = i === -1
            ? this.detalles.findIndex( d => 
                ( d.id === undefined || detalle.id === undefined )
                    ? false
                    : ( d.id === detalle.id )
            )
            : i;

        if ( i !== -1 ) {
            return this.detalles[ i ];
        }
        else {
            throw new ErrorModel( 'Detalle no existe' );
        }
    }


    setCliente( cliente: Cliente ): this
    {
        this.cliente = cliente;
        return this;
    }


    setReceptorDocumentoIdentificacion( documentoIdentificacion: DocumentoIdentificacion ): this
    {
        this.receptorDocumentoIdentificacion = documentoIdentificacion;
        return this;
    }


    setLiquidacionTipo( id: 1 | 2 ): this
    {
        this.liquidacionTipo = new LiquidacionTipo({ id });
        if ( id === 2 ) this.credito.procesarInformacionTransaccion();
        return this;
    }


    override procesarInformacionTransaccion(): this
    {
        try {

            super.procesarInformacionTransaccion();

            this.detalles.forEach( detalle => detalle.calcularImportes() );

            this.importeBruto = this.detalles.reduce( 
                ( decimal, detalle ) => decimal.plus( detalle.importeBruto ), 
                new Decimal( 0 ) 
            )
            .toDecimalPlaces( 2 )
            .toNumber() ;
    
            this.importeDescuento = this.detalles.reduce( 
                ( decimal, detalle ) => decimal.plus( detalle.importeDescuento ), 
                new Decimal( 0 ) 
            )
            .toDecimalPlaces( 2 )
            .toNumber();
    
            this.importeNeto = new Decimal( this.importeBruto )
                                .minus( this.importeDescuento )
                                .minus( this.importeAnticipo )
                                .toDecimalPlaces( 2 )
                                .toNumber();


            if ( this.liquidacionTipo?.id === 2 ) {
                this.credito.procesarInformacionTransaccion()
            }
            else {
                this.credito = new NotaVentaCredito();
                this.presetCredito();
            };

        }
        catch ( error: any ) {
            console.log( error );
            throw new ErrorModel( 'Error al calcular información de Transacción de Nota de Venta', error );
        }

        return this;
    }


    override procesarInformacionMovimiento(): this 
    {
        try {

            super.procesarInformacionMovimiento();

            this.credito.set({
                movimientosEfectivo: this.movimientosEfectivo,
                movimientosPantalla: this.movimientosPantalla,
                movimientosProducto: this.movimientosProducto
            })
            .procesarInformacionMovimiento();

        }
        catch ( error: any ) {
            throw new ErrorModel( 'Error al calular información de Movimientos de Nota de Venta', error );
        }

        return this;
    }
}