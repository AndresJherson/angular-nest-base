import { Cuota, NotaVentaCredito, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class NotaVentaCuota extends Cuota
{
    static override type = 'NotaVentaCuota';
    @Prop.Set() override type: string = NotaVentaCuota.type;

    @Prop.Set( PropBehavior.model, () => NotaVentaCredito ) declare credito?: NotaVentaCredito;
    

    constructor( json?: Partial<NotaVentaCuota> )
    {
        super();
        Prop.initialize( this, json );
    }
}