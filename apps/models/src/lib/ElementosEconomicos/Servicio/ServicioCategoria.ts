import { Model, Prop } from "../../Model";

export class ServicioCategoria extends Model
{
    @Prop.Set() nombre?: string;
    

    constructor( json?: Partial<ServicioCategoria> )
    {
        super();
        Prop.initialize( this, json );
    }
}