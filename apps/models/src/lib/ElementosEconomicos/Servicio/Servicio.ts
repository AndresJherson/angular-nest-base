import { Prop, PropBehavior } from "../../Model";
import { ElementoEconomico } from "../ElementoEconomico";
import { ServicioCategoria } from "./ServicioCategoria";

@Prop.Class()
export class Servicio extends ElementoEconomico
{
    @Prop.Set( PropBehavior.model, () => ServicioCategoria ) servicioCategoria?: ServicioCategoria;
    @Prop.Set() override type: string = Servicio.name;


    constructor( json?: Partial<Servicio> )
    {
        super();
        Prop.initialize( this, json );
    }
}