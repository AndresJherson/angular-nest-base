import { CreditoAsociado, NotaVenta, NotaVentaCuota, Prop, PropBehavior } from '../../../index';

@Prop.Class()
export class NotaVentaCredito extends CreditoAsociado
{
    static override type = 'NotaVentaCredito';
    @Prop.Set() override type: string = NotaVentaCredito.type;

    @Prop.Set( PropBehavior.model, () => NotaVenta ) declare documentoTransaccion?: NotaVenta;
    @Prop.Set( PropBehavior.array, () => NotaVentaCuota ) override cuotas: NotaVentaCuota[] = [];
    

    
    constructor( json?: Partial<NotaVentaCredito> )
    {
        super();
        Prop.initialize( this, json );
    }
}