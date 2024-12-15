import { Prop, PropBehavior } from '../../Model';
import { Credito } from '../Credito';
import { Cuota } from '../Cuota';
import { NotaVentaCredito } from './NotaVentaCredito';

export class NotaVentaCuota extends Cuota
{
    @Prop.Set( PropBehavior.model, () => NotaVentaCredito ) declare credito?: NotaVentaCredito;
    

    constructor( json?: Partial<NotaVentaCuota> )
    {
        super();
        Prop.initialize( this, json );
    }
}