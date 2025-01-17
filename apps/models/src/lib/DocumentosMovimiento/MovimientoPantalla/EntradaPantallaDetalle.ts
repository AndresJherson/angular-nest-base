import { EntradaPantalla, MovimientoPantallaDetalle, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class EntradaPantallaDetalle extends MovimientoPantallaDetalle
{
    static override type = 'EntradaPantallaDetalle';
    @Prop.Set( PropBehavior.model, () => EntradaPantalla ) declare documentoMovimiento?: EntradaPantalla;
    @Prop.Set() override type: string = EntradaPantallaDetalle.type;
    

    constructor( json?: Partial<EntradaPantallaDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}