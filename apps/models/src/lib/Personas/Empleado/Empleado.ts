import { Model, DocumentoIdentificacion, Genero, Prop, PropBehavior, Usuario } from "../../../index";

@Prop.Class()
export class Empleado extends Model
{
    static override type = 'Empleado';
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