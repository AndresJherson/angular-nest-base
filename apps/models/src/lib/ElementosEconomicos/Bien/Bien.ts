import { BienCategoria, BienMarca, ElementoEconomico, Magnitud, Prop, PropBehavior } from "../../../index";

@Prop.Class()
export class Bien extends ElementoEconomico
{
    static override type = 'Bien';
    @Prop.Set() override type: string = Bien.type;

    @Prop.Set( PropBehavior.model, () => BienMarca ) bienMarca?: BienMarca;
    @Prop.Set( PropBehavior.model, () => BienCategoria ) bienCategoria?: BienCategoria;
    @Prop.Set( PropBehavior.model, () => Magnitud ) magnitud?: Magnitud;
    

    constructor( json?: Partial<Bien> )
    {
        super();
        Prop.initialize( this, json );
    } 
}