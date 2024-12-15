import { Prop, PropBehavior } from "../Model";
import { EntradaProducto } from "./EntradaProducto";
import { MovimientoProductoDetalle } from "./MovimientoProductoDetalle";

@Prop.Class()
export class EntradaProductoDetalle extends MovimientoProductoDetalle
{
    @Prop.Set( PropBehavior.model, () => EntradaProducto ) declare documentoMovimiento?: EntradaProducto;


    constructor( json?: Partial<EntradaProductoDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}