import { MagnitudTipo } from "./MagnitudTipo";
import { Model, Prop, PropBehavior } from "./Model";

export class Magnitud extends Model
{
    @Prop.Set() nombre?: string;
    @Prop.Set( PropBehavior.model, () => MagnitudTipo ) magnitudTipo?: MagnitudTipo;


    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    }
}