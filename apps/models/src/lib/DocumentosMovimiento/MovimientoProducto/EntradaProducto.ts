import { EntradaProductoDetalle, MovimientoProducto, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class EntradaProducto extends MovimientoProducto
{
    static override type = 'EntradaProducto';
    @Prop.Set( PropBehavior.array, () => EntradaProductoDetalle ) override detalles: EntradaProductoDetalle[] = [];
    @Prop.Set() override type = EntradaProducto.type;

    constructor( json?: Partial<EntradaProducto> )
    {
        super();
        Prop.initialize( this, json );
    }
}