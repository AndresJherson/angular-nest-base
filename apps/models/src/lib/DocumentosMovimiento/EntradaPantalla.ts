import { Prop, PropBehavior } from "../Model";
import { EntradaPantallaDetalle } from "./EntradaPantallaDetalle";
import { MovimientoPantalla } from "./MovimientoPantalla";
import { MovimientoPantallaDetalle } from "./MovimientoPantallaDetalle";

@Prop.Class()
export class EntradaPantalla extends MovimientoPantalla
{
    @Prop.Set( PropBehavior.array, () => EntradaPantallaDetalle ) override detalles: EntradaPantallaDetalle[] = [];
    @Prop.Set() override type = EntradaPantalla.name;
    

    constructor( json?: Partial<EntradaPantalla> ) 
    {
        super(); 
        Prop.initialize( this, json );
    }
}