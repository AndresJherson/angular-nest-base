import { MagnitudTipo, Model, Prop, PropBehavior } from "../../../index";

@Prop.Class()
export class Magnitud extends Model
{
    static override type = 'Magnitud';
    @Prop.Set() nombre?: string;
    @Prop.Set( PropBehavior.model, () => MagnitudTipo ) magnitudTipo?: MagnitudTipo;


    constructor( json?: Partial<Magnitud> )
    {
        super();
        Prop.initialize( this, json );
    }
}