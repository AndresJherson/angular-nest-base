import { MovimientoPantallaDetalle, Prop, PropBehavior, SalidaPantalla } from '../../../index';

@Prop.Class()
export class SalidaPantallaDetalle extends MovimientoPantallaDetalle
{
    static override type = 'SalidaPantallaDetalle';
    @Prop.Set( PropBehavior.model, () => SalidaPantalla ) declare documentoMovimiento?: SalidaPantalla;
    @Prop.Set() override type: string = SalidaPantallaDetalle.type;
    

    constructor( json?: Partial<SalidaPantallaDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}