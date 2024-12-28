import { BienCategoria } from "./BienCategoria";
import { BienMarca } from "./BienMarca";
import { ElementoEconomico } from "../ElementoEconomico";
import { Magnitud } from "./Magnitud";
import { Prop, PropBehavior } from "../../Model";

@Prop.Class()
export class Bien extends ElementoEconomico
{
    @Prop.Set( PropBehavior.model, () => BienMarca ) bienMarca?: BienMarca;
    @Prop.Set( PropBehavior.model, () => BienCategoria ) bienCategoria?: BienCategoria;
    @Prop.Set( PropBehavior.model, () => Magnitud ) magnitud?: Magnitud;
    @Prop.Set() override type: string = Bien.name;
    

    constructor( json?: Partial<Bien> )
    {
        super();
        Prop.initialize( this, json );
    } 
}