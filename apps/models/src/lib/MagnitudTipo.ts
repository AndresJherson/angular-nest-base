import { Model, Prop } from "./Model";

export class MagnitudTipo extends Model
{
    @Prop.Set() nombre?: string;


    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    }
}