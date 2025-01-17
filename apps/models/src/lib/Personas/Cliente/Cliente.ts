import { DocumentoIdentificacion, Genero, Model, Prop, PropBehavior } from "../../../index";

@Prop.Class()
export class Cliente extends Model
{
    static override type = 'Cliente';
    @Prop.Set( PropBehavior.model, () => DocumentoIdentificacion ) documentoIdentificacion?: DocumentoIdentificacion;
    @Prop.Set() codigo?: string;
    @Prop.Set() nombre?: string;
    @Prop.Set() apellido?: string;
    @Prop.Set( PropBehavior.model, () => Genero ) genero?: Genero;
    @Prop.Set() celular?: number;
    @Prop.Set() celularRespaldo?: number;


    constructor( json?: Partial<Cliente> )
    {
        super();
        Prop.initialize( this, json );
    }
}