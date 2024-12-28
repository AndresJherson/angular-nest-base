import { Model, Prop, PropBehavior } from "../../Model";
import { DocumentoIdentificacion } from "../DocumentoIdentificacion";
import { Genero } from "../Genero";

@Prop.Class()
export class Cliente extends Model
{
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