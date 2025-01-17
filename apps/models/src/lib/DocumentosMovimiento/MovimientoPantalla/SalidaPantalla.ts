import { MovimientoPantalla, Prop, PropBehavior, SalidaPantallaDetalle } from '../../../index';

@Prop.Class()
export class SalidaPantalla extends MovimientoPantalla
{
    static override type = 'SalidaPantalla';
    @Prop.Set( PropBehavior.array, () => SalidaPantallaDetalle ) override detalles: SalidaPantallaDetalle[] = [];
    @Prop.Set() override type = SalidaPantalla.type;


    constructor( json?: Partial<SalidaPantalla> )
    {
        super();
        Prop.initialize( this, json );
    }
}