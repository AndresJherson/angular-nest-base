import Decimal from "decimal.js";
import { DocumentoTransaccion } from "../DocumentoTransaccion";
import { Cliente } from "../../Personas/Cliente";
import { Prop, PropBehavior } from "../../Model";
import { DocumentoIdentificacion } from "../../Personas/DocumentoIdentificacion";
import { LiquidacionTipo } from "../LiquidacionTipo";
import { NotaVentaDetalle } from "./NotaVentaDetalle";
import { NotaVentaCredito } from "./NotaVentaCredito";
import { ErrorModel } from "../../utils/ErrorModel";


export class NotaVenta extends DocumentoTransaccion
{
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
    @Prop.Set() override type: string = NotaVenta.name;


    constructor( json?: Partial<NotaVenta> )
    {
        super();
        Prop.initialize( this, json );
    }


    agregarDetalle( detalle: NotaVentaDetalle ): this
    {
        this.detalles.unshift( detalle );
        this.calcularInformacionTransaccion();
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
            this.calcularInformacionTransaccion();
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

        this.calcularInformacionTransaccion();

        return this;
    }


    override calcularInformacionTransaccion(): this
    {
        try {

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

            if ( this.liquidacionTipo?.id === 2 ) this.credito.calcularInformacionTransaccion( this );

        }
        catch ( error: any ) {
            throw new ErrorModel( 'Error al calcular importes de Nota de Venta', error );
        }

        return this;
    }
}