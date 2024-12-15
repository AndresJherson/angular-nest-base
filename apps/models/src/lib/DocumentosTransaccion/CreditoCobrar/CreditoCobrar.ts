import { Prop, PropBehavior } from "../../Model";
import { Credito } from "../Credito";
import { Cuota } from "../Cuota";
import { CuotaCobrar } from "./CuotaCobrar";

export class CreditoCobrar extends Credito
{
    @Prop.Set( PropBehavior.array, () => CuotaCobrar ) override cuotas: CuotaCobrar[] = []
    

    constructor( json?: Partial<CreditoCobrar> )
    {
        super();
        Prop.initialize( this, json );
    }
}