import { DocumentoIdentificacion } from "../DocumentoIdentificacion";
import { Genero } from "../Genero";
import { Model, Prop, PropBehavior } from "../../Model"
import { Usuario } from "../Usuario/Usuario";

@Prop.Class()
export class Empleado extends Model
{
    @Prop.Set( PropBehavior.model, () => DocumentoIdentificacion ) documentoIdentificacion?: DocumentoIdentificacion;
    @Prop.Set() codigo?: string;
    @Prop.Set() nombre?: string;
    @Prop.Set() apellido?: string;
    @Prop.Set() domicilio?: string;
    @Prop.Set( PropBehavior.model, () => Genero ) genero?: Genero;
    @Prop.Set() celular?: number;
    @Prop.Set() celularRespaldo?: number;
    @Prop.Set() esTecnico: boolean = false;
    @Prop.Set( PropBehavior.model, () => Usuario ) usuario?: Usuario;


    constructor( json?: Partial<Empleado> )
    {
        super();
        Prop.initialize( this, json );
    }
}