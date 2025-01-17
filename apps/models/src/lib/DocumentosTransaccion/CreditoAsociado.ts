import { Credito, DocumentoTransaccion, Prop, PropBehavior } from '../../index';

@Prop.Class()
export class CreditoAsociado extends Credito
{
    static override type = 'CreditoAsociado';
    @Prop.Set() override type: string = CreditoAsociado.type;

    @Prop.Set( PropBehavior.model, () => DocumentoTransaccion ) documentoTransaccion?: DocumentoTransaccion;

    constructor( json?: Partial<CreditoAsociado> )
    {
        super();
        Prop.initialize( this, json );
    }

}