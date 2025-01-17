import { Credito, CuotaCobrar, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class CreditoCobrar extends Credito
{
    static override type = 'CreditoCobrar';
    @Prop.Set() override type: string = CreditoCobrar.type;
    
    @Prop.Set( PropBehavior.array, () => CuotaCobrar ) override cuotas: CuotaCobrar[] = [];
    

    constructor( json?: Partial<CreditoCobrar> )
    {
        super();
        Prop.initialize( this, json );
    }
}