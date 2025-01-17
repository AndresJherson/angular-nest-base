import { Model, Prop } from "../../../../index";

@Prop.Class()
export class PantallaMarca extends Model
{
    static override type = 'PantallaMarca';
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<PantallaMarca> )
    {
        super();
        Prop.initialize( this, json );
    }
}