import { Prop, PropBehavior } from "../../Model";
import { MovimientoPantalla } from "./MovimientoPantalla";
import { MovimientoPantallaDetalle } from "./MovimientoPantallaDetalle";
import { SalidaPantallaDetalle } from "./SalidaPantallaDetalle";

@Prop.Class()
export class SalidaPantalla extends MovimientoPantalla
{
    @Prop.Set( PropBehavior.array, () => SalidaPantallaDetalle ) override detalles: SalidaPantallaDetalle[] = [];
    @Prop.Set() override type = SalidaPantalla.name;


    constructor( json?: Partial<SalidaPantalla> )
    {
        super();
        Prop.initialize( this, json );
    }
}