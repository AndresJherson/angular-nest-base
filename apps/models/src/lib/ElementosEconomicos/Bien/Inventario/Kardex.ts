import { Bien, BienInventario, KardexMovimiento, Model, Prop, PropBehavior } from '../../../../index';

@Prop.Class()
export class Kardex<T extends Bien> extends Model
{
    static override type = 'Kardex';
    @Prop.Set() type: string = Kardex.type;

    @Prop.Set( PropBehavior.model, () => Bien ) articulo?: T;
    @Prop.Set( PropBehavior.model, () => BienInventario ) total: BienInventario = new BienInventario();
    @Prop.Set( PropBehavior.date ) fechaInicial?: string;
    @Prop.Set( PropBehavior.date ) fechaFinal?: string;
    @Prop.Set() metodo?: string;
    @Prop.Set( PropBehavior.array, () => KardexMovimiento ) movimientos: KardexMovimiento[] = [];


    constructor( item?: Partial<Kardex<T>> )
    {
        super();
        Prop.initialize( this, item );
    }
}