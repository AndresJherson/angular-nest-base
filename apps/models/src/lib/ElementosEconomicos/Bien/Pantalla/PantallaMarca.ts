import { Model, Prop } from "../../../Model";

@Prop.Class()
export class PantallaMarca extends Model
{
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<PantallaMarca> )
    {
        super();
        Prop.initialize( this, json );
    }
}