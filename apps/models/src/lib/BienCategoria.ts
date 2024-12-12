import { Model, Prop } from "./Model";

export class BienCategoria extends Model
{
    @Prop.Set() nombre?: string;

    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    }
}