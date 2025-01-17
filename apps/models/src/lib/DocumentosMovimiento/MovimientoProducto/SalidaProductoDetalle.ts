import { MovimientoProductoDetalle, Prop, PropBehavior, SalidaProducto } from '../../../index';

@Prop.Class()
export class SalidaProductoDetalle extends MovimientoProductoDetalle
{
    static override type = 'SalidaProductoDetalle';
    @Prop.Set() override type: string = SalidaProductoDetalle.type;

    @Prop.Set( PropBehavior.model, () => SalidaProducto ) declare documentoMovimiento?: SalidaProducto;


    constructor( json?: Partial<SalidaProductoDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}