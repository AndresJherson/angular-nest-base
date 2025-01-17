import { Credito, CuotaPagar, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class CreditoPagar extends Credito
{
    static override type = 'CreditoPagar';
    @Prop.Set() override type: string = CreditoPagar.type;

    @Prop.Set( PropBehavior.model, () => CuotaPagar ) override cuotas: CuotaPagar[] = [];

    constructor( json?: Partial<CreditoPagar> )
    {
        super();
        Prop.initialize( this, json );
    }
}