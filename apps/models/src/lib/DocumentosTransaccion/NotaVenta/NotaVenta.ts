import Decimal from "decimal.js";
import { DocumentoTransaccion } from "../DocumentoTransaccion";
import { Prop, PropBehavior } from "../../Model";
import { DocumentoIdentificacion } from "../../Personas/DocumentoIdentificacion";
import { LiquidacionTipo } from "../LiquidacionTipo";
import { NotaVentaDetalle } from "./NotaVentaDetalle";
import { NotaVentaCredito } from "./NotaVentaCredito";
import { ErrorModel } from "../../utils/ErrorModel";
import { Cliente } from "../../Personas/Cliente/Cliente";
import { Credito } from "../Credito";


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
    }


    override setKeysSQL( keys: {
        id: number,
        notaId: number,
        detalleId: number,
        creditoId: number,
        cuotaId: number
    } ): this {


        this.notas.forEach( nota => nota.set({
            documentoTransaccion: new DocumentoTransaccion({ id: this.id })
        }) );
        

        this.detalles.reduce( 
            ( id, detalle ) => {
            
                detalle.set({
                    id: id,
                    notaVenta: new NotaVenta({ id: this.id })
                });

                return id++;
            },
            keys.detalleId
        );

        
        this.credito.set({
            id: keys.creditoId,
            documentoTransaccion: new NotaVenta({id: this.id})
        });


        this.credito.cuotas.reduce(
            ( id, cuota ) => {

                cuota.set({
                    id: id,
                    credito: new Credito({ id: keys.creditoId })
                });

                return id++;
            },
            keys.cuotaId
        );
        

        return this;
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
        if ( id === 2 ) this.credito.calcularInformacionTransaccion();
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

            if ( this.liquidacionTipo?.id === 2 ) this.credito.calcularInformacionTransaccion();

        }
        catch ( error: any ) {
            throw new ErrorModel( 'Error al calcular importes de Nota de Venta', error );
        }

        return this;
    }
}