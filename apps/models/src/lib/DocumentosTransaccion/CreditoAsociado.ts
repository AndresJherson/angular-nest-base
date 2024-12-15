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


    override calcularInformacionTransaccion( documentoTransaccion?: DocumentoTransaccion ): this 
    {   
        try {

            this.importeCapitalInicial = documentoTransaccion?.importeNeto ?? 0;
            super.calcularInformacionTransaccion();

        }
        catch ( error ) {
            throw new ErrorModel( 'Error al calcular información del crédito', error );
        }

        return this;
    }

}