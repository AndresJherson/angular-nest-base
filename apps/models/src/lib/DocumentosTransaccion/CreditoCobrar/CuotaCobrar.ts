import { CreditoCobrar, Cuota, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class CuotaCobrar extends Cuota
{
    static override type = 'CuotaCobrar';
    @Prop.Set() override type: string = CuotaCobrar.type;

    @Prop.Set( PropBehavior.model, () => CreditoCobrar ) declare credito?: CreditoCobrar;

    
    constructor( json?: Partial<CuotaCobrar> )
    {
        super();
        Prop.initialize( this, json );
    }
}