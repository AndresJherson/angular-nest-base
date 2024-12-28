import { Prop } from "../../Model";
import { MovimientoEfectivo } from "./MovimientoEfectivo";

@Prop.Class()
export class EntradaEfectivo extends MovimientoEfectivo
{
    @Prop.Set() override type: string = EntradaEfectivo.name;

    
    constructor( json?: Partial<EntradaEfectivo> )
    {
        super();
        Prop.initialize( this, json );
    }
}