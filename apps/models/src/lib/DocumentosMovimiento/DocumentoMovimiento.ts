import { DocumentoTransaccion, Model, Prop, PropBehavior, Usuario } from "../../index";

@Prop.Class()
export class DocumentoMovimiento extends Model
{
    static override type = 'DocumentoMovimiento';
    @Prop.Set() type = DocumentoMovimiento.type;

    @Prop.Set() uuid?: string;
    @Prop.Set() codigo?: string;
    @Prop.Set( PropBehavior.datetime ) fechaEmision?: string;
    @Prop.Set( PropBehavior.datetime ) fechaAnulacion?: string;

    @Prop.Set( PropBehavior.model, () => Usuario ) usuario?: Usuario;
    @Prop.Set() concepto?: string;
    @Prop.Set() importeNeto: number = 0;
    @Prop.Set( PropBehavior.model, () => DocumentoTransaccion ) documentoTransaccion?: DocumentoTransaccion;


    constructor( json?: Partial<DocumentoMovimiento> )
    {
        super();
        Prop.initialize( this, json );
    }


    emitir(): this
    {
        const dateTime = Prop.toDateTime( this.fechaEmision ?? '' );
        this.fechaEmision = dateTime.isValid ? dateTime.toSQL() : Prop.toDateTimeNow().toSQL();
        return this;
    }


    anular(): this
    {
        const dateTime = Prop.toDateTime( this.fechaAnulacion ?? '' );
        this.fechaAnulacion = dateTime.isValid ? dateTime.toSQL() : Prop.toDateTimeNow().toSQL();
        return this;
    }


    procesarInformacionMovimiento(): this
    {
        return this;
    }
}