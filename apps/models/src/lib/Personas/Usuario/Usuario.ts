import { Model, Prop } from "../../../index";

@Prop.Class()
export class Usuario extends Model
{
    static override type = 'Usuario';
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
