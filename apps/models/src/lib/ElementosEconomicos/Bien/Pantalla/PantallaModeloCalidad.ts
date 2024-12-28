import { Calidad } from "./Calidad";
import { Model, Prop, PropBehavior } from "../../../Model";
import { PantallaModelo } from "./PantallaModelo";
import { ElementoEconomico } from "../../ElementoEconomico";

@Prop.Class()
export class PantallaModeloCalidad extends ElementoEconomico
{
    @Prop.Set( PropBehavior.model, () => PantallaModelo ) pantallaModelo?: PantallaModelo;
    @Prop.Set( PropBehavior.model, () => Calidad ) calidad?: Calidad;
    @Prop.Set() override esSalida: boolean = true;
    @Prop.Set() override type: string = PantallaModeloCalidad.name;


    constructor( json?: Partial<PantallaModeloCalidad> )
    {
        super();
        Prop.initialize( this, json );
    }
}