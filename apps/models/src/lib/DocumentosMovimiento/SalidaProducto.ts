import { Prop, PropBehavior } from "../Model";
import { MovimientoProducto } from "./MovimientoProducto";
import { MovimientoProductoDetalle } from "./MovimientoProductoDetalle";
import { SalidaProductoDetalle } from "./SalidaProductoDetalle";

@Prop.Class()
export class SalidaProducto extends MovimientoProducto
{
    @Prop.Set( PropBehavior.array, () => SalidaProductoDetalle ) override detalles: SalidaProductoDetalle[] = [];
    @Prop.Set() override type = SalidaProducto.name;


    constructor( json?: Partial<SalidaProducto> )
    {
        super();
        Prop.initialize( this, json );
    }
}