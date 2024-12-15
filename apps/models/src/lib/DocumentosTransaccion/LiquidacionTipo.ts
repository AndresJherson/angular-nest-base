import { Model, Prop } from "../Model";

export class LiquidacionTipo extends Model
{
    @Prop.Set() nombre?: string;
    

    constructor( json?: Partial<LiquidacionTipo> )
    {
        super();
        Prop.initialize( this, json );
    }
}