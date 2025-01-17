import { Model, Prop } from "../../index";

@Prop.Class()
export class DocumentoIdentificacion extends Model
{
    static override type = 'DocumentoIdentificacion';
    @Prop.Set() nombre?: string;

    constructor( json?: Partial<DocumentoIdentificacion> )
    {
        super();
        Prop.initialize( this, json );
    }
}