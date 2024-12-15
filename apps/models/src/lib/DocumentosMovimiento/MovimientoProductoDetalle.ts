import Decimal from "decimal.js";
import { Producto } from "../ElementosEconomicos/Producto";
import { Model, Prop, PropBehavior } from "../Model";
import { MovimientoProducto } from "./MovimientoProducto";
import { ErrorModel } from "../utils/ErrorModel";

@Prop.Class()
export class MovimientoProductoDetalle extends Model
{
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
}