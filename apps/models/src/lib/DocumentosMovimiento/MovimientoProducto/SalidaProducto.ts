import { MovimientoProducto, Prop, PropBehavior, SalidaProductoDetalle } from '../../../index';

@Prop.Class()
export class SalidaProducto extends MovimientoProducto
{
    static override type = 'SalidaProducto';
    @Prop.Set() override type = SalidaProducto.type;
    
    @Prop.Set( PropBehavior.array, () => SalidaProductoDetalle ) override detalles: SalidaProductoDetalle[] = [];


    constructor( json?: Partial<SalidaProducto> )
    {
        super();
        Prop.initialize( this, json );
    }
}