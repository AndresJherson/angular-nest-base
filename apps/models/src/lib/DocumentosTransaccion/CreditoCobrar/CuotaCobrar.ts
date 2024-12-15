import { Prop, PropBehavior } from "../../Model";
import { Credito } from "../Credito";
import { CreditoCobrar } from "./CreditoCobrar";
import { Cuota } from "../Cuota";

export class CuotaCobrar extends Cuota
{
    @Prop.Set( PropBehavior.model, () => CreditoCobrar ) declare credito?: CreditoCobrar;

    
    constructor( json?: Partial<CuotaCobrar> )
    {
        super();
        Prop.initialize( this, json );
    }
}