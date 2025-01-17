import { Calidad, ElementoEconomico, PantallaModelo, Prop, PropBehavior } from "../../../../index";

@Prop.Class()
export class PantallaModeloCalidad extends ElementoEconomico
{
    static override type = 'PantallaModeloCalidad';
    @Prop.Set() override type: string = PantallaModeloCalidad.type;

    @Prop.Set( PropBehavior.model, () => PantallaModelo ) pantallaModelo?: PantallaModelo;
    @Prop.Set( PropBehavior.model, () => Calidad ) calidad?: Calidad;
    @Prop.Set() override esSalida: boolean = true;
    


    constructor( json?: Partial<PantallaModeloCalidad> )
    {
        super();
        Prop.initialize( this, json );
    }
}