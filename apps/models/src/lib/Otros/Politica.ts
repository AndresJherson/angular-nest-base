import { Model, Prop } from "../Model";

export class Politica extends Model
{
    @Prop.Set() descripcion?: string;
    @Prop.Set() esActivo: number = 1;

    constructor( json?: Partial<Politica> )
    {
        super();
        Prop.initialize( this, json );
    }
}