import { Model, Prop } from "../../../../index";

@Prop.Class()
export class Calidad extends Model
{
    static override type = 'Calidad';
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<Calidad> )
    {
        super();
        Prop.initialize( this, json );
    }
}