import { DocumentoTransaccion, Model, Prop, PropBehavior, Usuario } from '../../index';

@Prop.Class()
export class Nota extends Model
{
    static override type = 'Nota';

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