import { Prop, PropBehavior } from "../Model";
import { ErrorModel } from "../utils/ErrorModel";
import { Credito } from "./Credito";
import { DocumentoTransaccion } from './DocumentoTransaccion';

export class CreditoAsociado extends Credito
{
    @Prop.Set( PropBehavior.model, () => DocumentoTransaccion ) documentoTransaccion?: DocumentoTransaccion;

    constructor( json?: Partial<CreditoAsociado> )
    {
        super();
        Prop.initialize( this, json );
    }

}