import { Prop, PropBehavior } from "../Model";
import { MovimientoProductoDetalle } from "./MovimientoProductoDetalle";
import { SalidaProducto } from "./SalidaProducto";

@Prop.Class()
export class SalidaProductoDetalle extends MovimientoProductoDetalle
{
    @Prop.Set( PropBehavior.model, () => SalidaProducto ) declare documentoMovimiento?: SalidaProducto;


    constructor( json?: Partial<SalidaProductoDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}