import { DocumentoTransaccion, Model, Prop, PropBehavior, Usuario } from '../../index';

@Prop.Class()
export class Carpeta extends Model
{
    static override type = 'Carpeta';

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