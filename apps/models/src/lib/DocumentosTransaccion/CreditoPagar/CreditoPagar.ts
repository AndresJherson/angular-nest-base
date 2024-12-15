import { Prop, PropBehavior } from "../../Model";
import { Credito } from "../Credito";
import { Cuota } from "../Cuota";
import { CuotaPagar } from "./CuotaPagar";

export class CreditoPagar extends Credito
{
    @Prop.Set( PropBehavior.model, () => CuotaPagar ) override cuotas: CuotaPagar[] = [];

    constructor( json?: Partial<CreditoPagar> )
    {
        super();
        Prop.initialize( this, json );
    }
}