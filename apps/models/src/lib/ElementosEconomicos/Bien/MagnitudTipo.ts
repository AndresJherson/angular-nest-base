import { Model, Prop } from "../../../index";

@Prop.Class()
export class MagnitudTipo extends Model
{
    static override type = 'MagnitudTipo';
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<MagnitudTipo> )
    {
        super();
        Prop.initialize( this, json );
    }
}