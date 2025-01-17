import { Model, Prop } from "../../../index";

export class ServicioCategoria extends Model
{
    static override type = 'ServicioCategoria';
    @Prop.Set() nombre?: string;
    

    constructor( json?: Partial<ServicioCategoria> )
    {
        super();
        Prop.initialize( this, json );
    }
}