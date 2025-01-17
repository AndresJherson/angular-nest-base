import Decimal from "decimal.js";
import { DocumentoMovimiento, MovimientoPantallaDetalle, Prop, PropBehavior } from '../../../index';
import { ErrorModel } from "../../utils/ErrorModel";

@Prop.Class()
export class MovimientoPantalla extends DocumentoMovimiento
{
    static override type = 'MovimientoPantalla';
    @Prop.Set( PropBehavior.array, () => MovimientoPantallaDetalle ) detalles: MovimientoPantallaDetalle[] = [];
    @Prop.Set() override type: string = MovimientoPantalla.type;
    

    constructor( json?: Partial<MovimientoPantalla> )
    {
        super();
        Prop.initialize( this, json );
    }

    
    override set(item: Partial<MovimientoPantalla>): this 
    {
        return super.set( item as Partial<this> );
    }

    
    override setRelation(keys?: {
        id: number,
        detalleId: number
    }): this 
    {
        
        this.set({
            id: keys?.id ?? this.id
        })
        if ( keys ) keys.id++;


        this.detalles.forEach( detalle => {

            detalle.set({
                id: keys?.detalleId ?? detalle.id,
                documentoMovimiento: new MovimientoPantalla({ id: this.id, symbol: this.symbol, uuid: this.uuid, codigo: this.codigo })
            });
            if ( keys ) keys.detalleId++;

        } );

        return this;
    }
    

    // Detalles
    agregarDetalle( detalle: MovimientoPantallaDetalle ): this
    {
        this.detalles.unshift( detalle );
        this.procesarInformacionMovimiento();
        return this;
    }


    actualizarDetalle( detalle: MovimientoPantallaDetalle ): this
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
            this.procesarInformacionMovimiento();
        }
        return this;
    }


    eliminarDetalle( detalle: MovimientoPantallaDetalle ): this
    {
        this.detalles = this.detalles.filter( d => d.symbol !== detalle.symbol );
        this.detalles = this.detalles.filter( d => 
            ( d.id === undefined || detalle.id === undefined )
                ? true
                : ( d.id !== detalle.id )
        );

        this.procesarInformacionMovimiento();

        return this;
    }


    getDetalle( detalle: MovimientoPantallaDetalle ): MovimientoPantallaDetalle
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



    override procesarInformacionMovimiento(): this 
    {
        try {
            super.procesarInformacionMovimiento();
            
            this.importeNeto = this.detalles.reduce( 
                ( prev, curr ) => prev.plus( curr.calcularImportes().importeNeto ), 
                new Decimal( 0 ) 
            )
            .toNumber();

            return this;
        }
        catch ( error: any ) {
            throw new ErrorModel( 'Error en el cálculo de valor total de Documento de Movimiento de Pantalla', error );
        }
    }


    static initialize( data: Partial<MovimientoPantalla>[] ): MovimientoPantalla[]
    {
        return data.map( item => 
            new (
                Prop.GetClass<MovimientoPantalla>( item.type )
                ?? Prop.GetClass( Object.getPrototypeOf( item ) )
                ?? MovimientoPantalla
            )( item )
        )
    }
}