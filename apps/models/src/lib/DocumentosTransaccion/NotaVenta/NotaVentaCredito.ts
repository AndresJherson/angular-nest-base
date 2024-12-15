import { Prop, PropBehavior } from "../../Model";
import { CreditoAsociado } from "../CreditoAsociado";
import { Cuota } from "../Cuota";
import { DocumentoTransaccion } from "../DocumentoTransaccion";
import { NotaVenta } from "./NotaVenta";
import { NotaVentaCuota } from "./NotaVentaCuota";

export class NotaVentaCredito extends CreditoAsociado
{
    @Prop.Set( PropBehavior.model, () => NotaVenta ) declare documentoTransaccion?: NotaVenta;
    @Prop.Set( PropBehavior.array, () => NotaVentaCuota ) override cuotas: NotaVentaCuota[] = [];

    
    constructor( json?: Partial<NotaVentaCredito> )
    {
        super();
        Prop.initialize( this, json );
    }
}