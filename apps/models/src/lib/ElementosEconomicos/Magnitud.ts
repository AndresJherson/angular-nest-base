import { MagnitudTipo } from "./MagnitudTipo";
import { Model, Prop, PropBehavior } from "../Model";

@Prop.Class()
export class Magnitud extends Model
{
    @Prop.Set() nombre?: string;
    @Prop.Set( PropBehavior.model, () => MagnitudTipo ) magnitudTipo?: MagnitudTipo;


    constructor( json?: Partial<Magnitud> )
    {
        super();
        Prop.initialize( this, json );
    }
}