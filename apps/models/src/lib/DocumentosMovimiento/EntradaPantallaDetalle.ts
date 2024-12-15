import { Prop, PropBehavior } from "../Model";
import { EntradaPantalla } from "./EntradaPantalla";
import { MovimientoPantalla } from "./MovimientoPantalla";
import { MovimientoPantallaDetalle } from "./MovimientoPantallaDetalle";

@Prop.Class()
export class EntradaPantallaDetalle extends MovimientoPantallaDetalle
{
    @Prop.Set( PropBehavior.model, () => EntradaPantalla ) declare documentoMovimiento?: EntradaPantalla;
    

    constructor( json?: Partial<EntradaPantallaDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}