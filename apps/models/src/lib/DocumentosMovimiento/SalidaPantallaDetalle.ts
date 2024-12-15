import { Prop, PropBehavior } from "../Model";
import { MovimientoPantalla } from "./MovimientoPantalla";
import { MovimientoPantallaDetalle } from "./MovimientoPantallaDetalle";
import { SalidaPantalla } from "./SalidaPantalla";

@Prop.Class()
export class SalidaPantallaDetalle extends MovimientoPantallaDetalle
{
    @Prop.Set( PropBehavior.model, () => SalidaPantalla ) declare documentoMovimiento?: SalidaPantalla;
    

    constructor( json?: Partial<SalidaPantallaDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }
}