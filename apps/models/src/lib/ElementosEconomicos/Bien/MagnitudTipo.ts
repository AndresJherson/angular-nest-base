import { Model, Prop } from "../../Model";

@Prop.Class()
export class MagnitudTipo extends Model
{
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<MagnitudTipo> )
    {
        super();
        Prop.initialize( this, json );
    }
}