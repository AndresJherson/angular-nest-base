import { Prop, PropBehavior } from "../../Model";
import { Credito } from "../Credito";
import { CreditoPagar } from "./CreditoPagar";
import { Cuota } from "../Cuota";

export class CuotaPagar extends Cuota
{
    @Prop.Set( PropBehavior.model, () => CreditoPagar ) declare credito?: CreditoPagar;

    constructor( json?: Partial<CuotaPagar> )
    {
        super();
        Prop.initialize( this, json );
    }
}