import { Model, Prop } from "../Model";

@Prop.Class()
export class Establecimiento extends Model
{
    @Prop.Set() override id: number = 1;
    @Prop.Set() ruc?: string;
    @Prop.Set() razonSocial?: string;
    @Prop.Set() rubro?: string;
    @Prop.Set() domiciilio?: string;
    @Prop.Set() celular?: number;


    constructor( json?: Partial<Establecimiento> )
    {
        super();
        Prop.initialize( this, json );
    }
}