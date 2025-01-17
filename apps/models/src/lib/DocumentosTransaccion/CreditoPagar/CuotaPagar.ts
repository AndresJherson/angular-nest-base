import { CreditoPagar, Cuota, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class CuotaPagar extends Cuota
{
    static override type = 'CuotaPagar';
    @Prop.Set() override type: string = CuotaPagar.type;

    @Prop.Set( PropBehavior.model, () => CreditoPagar ) declare credito?: CreditoPagar;


    constructor( json?: Partial<CuotaPagar> )
    {
        super();
        Prop.initialize( this, json );
    }
}