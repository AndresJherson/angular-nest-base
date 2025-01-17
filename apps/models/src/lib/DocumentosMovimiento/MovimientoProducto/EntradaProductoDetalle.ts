import { EntradaProducto, MovimientoProductoDetalle, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class EntradaProductoDetalle extends MovimientoProductoDetalle
{
    static override type = 'EntradaProductoDetalle';
    @Prop.Set( PropBehavior.model, () => EntradaProducto ) declare documentoMovimiento?: EntradaProducto;
    @Prop.Set() override type: string = EntradaProductoDetalle.type;


    constructor( json?: Partial<EntradaProductoDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}