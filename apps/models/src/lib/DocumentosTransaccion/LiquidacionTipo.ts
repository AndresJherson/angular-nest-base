import { Model, Prop } from '../../index';

@Prop.Class()
export class LiquidacionTipo extends Model
{
    static override type = 'LiquidacionTipo';
    @Prop.Set() nombre?: string;
    

    constructor( json?: Partial<LiquidacionTipo> )
    {
        super();
        Prop.initialize( this, json );
    }
}