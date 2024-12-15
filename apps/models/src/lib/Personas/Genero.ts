import { Model, Prop } from "../Model";

@Prop.Class()
export class Genero extends Model
{
    @Prop.Set() nombre?: string;
    

    constructor( json?: Partial<Genero> )
    {
        super();
        Prop.initialize( this, json );
    }
}