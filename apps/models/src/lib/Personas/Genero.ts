import { Model, Prop } from "../../index";

@Prop.Class()
export class Genero extends Model
{
    static override type = 'Genero';
    @Prop.Set() nombre?: string;
    

    constructor( json?: Partial<Genero> )
    {
        super();
        Prop.initialize( this, json );
    }
}