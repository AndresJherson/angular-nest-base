import { Model, Prop } from "../Model";

@Prop.Class()
export class Calidad extends Model
{
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<Calidad> )
    {
        super();
        Prop.initialize( this, json );
    }
}