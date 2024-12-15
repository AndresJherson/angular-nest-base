import { Model, Prop, PropBehavior } from "../Model";
import { DocumentoTransaccion } from "./DocumentoTransaccion";

export class Nota extends Model
{
    @Prop.Set( PropBehavior.model, () => DocumentoTransaccion ) documentoTransaccion?: DocumentoTransaccion;
    @Prop.Set() descripcion?: string;

    constructor( json?: Partial<Nota> )
    {
        super();
        Prop.initialize( this, json );
    }
}