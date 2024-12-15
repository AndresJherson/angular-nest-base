import { Model, Prop } from "../Model";

@Prop.Class()
export class DocumentoIdentificacion extends Model
{
    @Prop.Set() nombre?: string;

    constructor( json?: Partial<DocumentoIdentificacion> )
    {
        super();
        Prop.initialize( this, json );
    }
}