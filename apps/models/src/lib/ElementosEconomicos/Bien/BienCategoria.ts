import { Model, Prop } from "../../Model";

@Prop.Class()
export class BienCategoria extends Model
{
    @Prop.Set() nombre?: string;

    constructor( json?: Partial<BienCategoria> )
    {
        super();
        Prop.initialize( this, json );
    }
}