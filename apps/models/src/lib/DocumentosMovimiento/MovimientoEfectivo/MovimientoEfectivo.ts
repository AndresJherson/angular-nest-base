import Decimal from "decimal.js";
import { Prop, PropBehavior } from "../../Model";
import { DocumentoMovimiento } from "../DocumentoMovimiento";
import { MedioTransferencia } from "../MedioTransferencia";
import { ErrorModel } from "../../utils/ErrorModel";

@Prop.Class()
export class MovimientoEfectivo extends DocumentoMovimiento
{
    @Prop.Set( PropBehavior.model, () => MedioTransferencia ) medioTransferencia?: MedioTransferencia;
    @Prop.Set() override type: string = MovimientoEfectivo.name;


    constructor( json?: Partial<MovimientoEfectivo> )
    {
        super();
        Prop.initialize( this, json );
    }


    override calcularInformacionMovimiento(): this 
    {
        try {
            this.importeNeto = new Decimal( this.importeNeto ).toNumber();
            return this;
        }
        catch ( error ) {
            throw new ErrorModel( 'Error en el cálculo del valor total de Documento de Movimiento de Efectivo', error );
        }
    }
}