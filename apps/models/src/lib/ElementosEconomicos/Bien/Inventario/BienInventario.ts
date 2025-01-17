import { Bien, Prop } from '../../../../index';

@Prop.Class()
export class BienInventario extends Bien
{
    static override type = 'BienInventario';
    @Prop.Set() override type: string = BienInventario.type;

    @Prop.Set() entradaCantidadTotal: number = 0;
    @Prop.Set() entradaCostoTotal: number = 0;
    @Prop.Set() salidaCantidadTotal: number = 0;
    @Prop.Set() salidaCostoTotal: number = 0;
    @Prop.Set() existencias: number = 0;
    @Prop.Set() costoUnitarioSalida: number = 0;
    @Prop.Set() valorTotal: number = 0;


    constructor( item?: Partial<BienInventario> )
    {
        super();
        Prop.initialize( this, item );
    }
}