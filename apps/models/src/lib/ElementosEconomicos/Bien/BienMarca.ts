import { Model, Prop } from "../../Model";

@Prop.Class()
export class BienMarca extends Model
{
    @Prop.Set() nombre?: string;

    constructor( json?: Partial<BienMarca> )
    {
        super();
        Prop.initialize( this, json );
    }
}