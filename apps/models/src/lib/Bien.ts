import { BienCategoria } from "./BienCategoria";
import { BienMarca } from "./BienMarca";
import { ElementoEconomico } from "./ElementoEconomico";
import { Magnitud } from "./Magnitud";
import { Prop, PropBehavior } from "./Model";

export class Bien extends ElementoEconomico
{
    @Prop.Set( PropBehavior.model, () => BienMarca ) bienMarca?: BienMarca;
    @Prop.Set( PropBehavior.model, () => BienCategoria ) bienCategoria?: BienCategoria;
    @Prop.Set( PropBehavior.model, () => Magnitud ) magnitud?: Magnitud;
    @Prop.Set() esSalida?: boolean;
    @Prop.Set() esEntrada?: boolean;
    @Prop.Set() esEncerio?: boolean;

    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    } 
}