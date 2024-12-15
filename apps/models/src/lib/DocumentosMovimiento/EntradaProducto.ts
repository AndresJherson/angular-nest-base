import { Prop, PropBehavior } from "../Model";
import { EntradaProductoDetalle } from "./EntradaProductoDetalle";
import { MovimientoProducto } from "./MovimientoProducto";
import { MovimientoProductoDetalle } from "./MovimientoProductoDetalle";

@Prop.Class()
export class EntradaProducto extends MovimientoProducto
{
    @Prop.Set( PropBehavior.array, () => EntradaProductoDetalle ) override detalles: EntradaProductoDetalle[] = [];
    @Prop.Set() override type = EntradaProducto.name;

    constructor( json?: Partial<EntradaProducto> )
    {
        super();
        Prop.initialize( this, json );
    }
}