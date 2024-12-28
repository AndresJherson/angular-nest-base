import { Model, Prop, PropBehavior } from "../Model";
import { Usuario } from "../Personas/Usuario/Usuario";
import { DocumentoTransaccion } from "./DocumentoTransaccion";

export class Nota extends Model
{
    @Prop.Set( PropBehavior.model, () => DocumentoTransaccion ) documentoTransaccion?: DocumentoTransaccion;
    @Prop.Set( PropBehavior.model, () => Usuario ) usuario?: Usuario;
    @Prop.Set( PropBehavior.datetime ) fechaCreacion?: string;
    @Prop.Set() descripcion?: string;
    

    constructor( json?: Partial<Nota> )
    {
        super();
        Prop.initialize( this, json );
    }
}