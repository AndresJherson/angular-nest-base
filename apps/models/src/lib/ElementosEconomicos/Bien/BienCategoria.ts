import { Model, Prop } from "../../../index";

@Prop.Class()
export class BienCategoria extends Model
{
    static override type = 'BienCategoria';
    @Prop.Set() nombre?: string;

    constructor( json?: Partial<BienCategoria> )
    {
        super();
        Prop.initialize( this, json );
    }
}