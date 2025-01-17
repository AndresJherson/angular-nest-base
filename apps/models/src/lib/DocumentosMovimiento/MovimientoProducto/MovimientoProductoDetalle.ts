import Decimal from "decimal.js";
import { Model, MovimientoProducto, Producto, Prop, PropBehavior } from '../../../index';
import { ErrorModel } from "../../utils/ErrorModel";

@Prop.Class()
export class MovimientoProductoDetalle extends Model
{
    static override type = 'MovimientoProductoDetalle';
    @Prop.Set() type: string = MovimientoProductoDetalle.type;
    
    @Prop.Set( PropBehavior.model, () => MovimientoProducto ) documentoMovimiento?: MovimientoProducto;
    @Prop.Set( PropBehavior.model, () => Producto ) producto?: Producto;
    @Prop.Set() cantidad: number = 0;
    @Prop.Set() importeUnitario: number = 0;
    @Prop.Set() importeNeto: number = 0;


    constructor( json?: Partial<MovimientoProductoDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }


    calcularImportes(): this
    {
        try {
            this.importeNeto = new Decimal( this.cantidad )
                                .mul( this.importeUnitario )
                                .toNumber();
            return this;
        }
        catch ( error ) {
            throw new ErrorModel( 'Error en el cálculo de valor total de detalles de Movimiento de Producto' );
        }
    }


    static initialize( data: Partial<MovimientoProductoDetalle>[] ): MovimientoProductoDetalle[]
    {
        return data.map( item => 
            new (
                Prop.GetClass<MovimientoProductoDetalle>( item.type )
                ?? Prop.GetClass( Object.getPrototypeOf( item ) )
                ?? MovimientoProductoDetalle
            )( item )
        );
    }
}