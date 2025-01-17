import { EntradaPantallaDetalle, MovimientoPantalla, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class EntradaPantalla extends MovimientoPantalla
{
    static override type = 'EntradaPantalla';
    @Prop.Set( PropBehavior.array, () => EntradaPantallaDetalle ) override detalles: EntradaPantallaDetalle[] = [];
    @Prop.Set() override type = EntradaPantalla.type;
    

    constructor( json?: Partial<EntradaPantalla> ) 
    {
        super(); 
        Prop.initialize( this, json );
    }
}