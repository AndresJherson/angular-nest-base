import { ElementoEconomico, Prop, PropBehavior, ServicioCategoria } from "../../../index";

@Prop.Class()
export class Servicio extends ElementoEconomico
{
    static override type = 'Servicio';
    @Prop.Set() override type: string = Servicio.type;

    @Prop.Set( PropBehavior.model, () => ServicioCategoria ) servicioCategoria?: ServicioCategoria;


    constructor( json?: Partial<Servicio> )
    {
        super();
        Prop.initialize( this, json );
    }
}