import { Model, Prop } from "../../../index";

@Prop.Class()
export class BienMarca extends Model
{
    static override type = 'BienMarca';
    @Prop.Set() nombre?: string;

    constructor( json?: Partial<BienMarca> )
    {
        super();
        Prop.initialize( this, json );
    }
}