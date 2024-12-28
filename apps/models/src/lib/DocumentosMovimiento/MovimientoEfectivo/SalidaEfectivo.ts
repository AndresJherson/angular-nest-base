import { Prop } from "../../Model";
import { MovimientoEfectivo } from "./MovimientoEfectivo";

@Prop.Class()
export class SalidaEfectivo extends MovimientoEfectivo
{
    @Prop.Set() override type: string = SalidaEfectivo.name;

    
    constructor( json?: Partial<SalidaEfectivo> )
    {
        super();
        Prop.initialize( this, json );
    }
}