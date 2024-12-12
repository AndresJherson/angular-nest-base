import { Model, Prop } from "./Model";

export class BienMarca extends Model
{
    @Prop.Set() nombre?: string;

    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    }
}