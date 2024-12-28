import { Model, Prop } from "../../Model";

@Prop.Class()
export class Usuario extends Model
{
    @Prop.Set() nombre?: string;
    @Prop.Set() usuario?: string;
    @Prop.Set() contrasena?: string;
    @Prop.Set() esActivo: boolean = true;

    
    constructor( json?: Partial<Usuario> )
    {
        super();
        Prop.initialize( this, json );
    }
}
