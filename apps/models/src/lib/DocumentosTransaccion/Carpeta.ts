import { Model, Prop, PropBehavior } from "../Model";
import { Usuario } from "../Personas/Usuario/Usuario";
import { DocumentoTransaccion } from "./DocumentoTransaccion";

@Prop.Class()
export class Carpeta extends Model
{
    @Prop.Set() nombre?: string;
    @Prop.Set( PropBehavior.datetime ) fechaCreacion?: string;
    @Prop.Set( PropBehavior.model, () => Usuario ) usuario?: Usuario;
    @Prop.Set( PropBehavior.array, () => DocumentoTransaccion ) documentosTransaccion: DocumentoTransaccion[] = [];
    

    constructor( json?: Partial<Carpeta> )
    {
        super();
        Prop.initialize( this, json );
    }
}