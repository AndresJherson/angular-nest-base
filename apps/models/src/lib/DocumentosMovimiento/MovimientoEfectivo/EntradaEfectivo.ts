import { MovimientoEfectivo, Prop } from "../../../index";

@Prop.Class()
export class EntradaEfectivo extends MovimientoEfectivo
{
    static override type = 'EntradaEfectivo';
    @Prop.Set() override type: string = EntradaEfectivo.type;

    
    constructor( json?: Partial<EntradaEfectivo> )
    {
        super();
        Prop.initialize( this, json );
    }
}