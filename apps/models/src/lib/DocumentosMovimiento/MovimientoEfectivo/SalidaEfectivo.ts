import { MovimientoEfectivo, Prop } from "../../../index";

@Prop.Class()
export class SalidaEfectivo extends MovimientoEfectivo
{
    static override type = 'SalidaEfectivo';
    @Prop.Set() override type: string = SalidaEfectivo.type;

    
    constructor( json?: Partial<SalidaEfectivo> )
    {
        super();
        Prop.initialize( this, json );
    }
}