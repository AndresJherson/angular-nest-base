import { BienInventario, Model, Prop, PropBehavior } from '../../../../index';

@Prop.Class()
export class Inventario extends Model
{
    static override type = 'Inventario';
    @Prop.Set() type: string = Inventario.type;
    
    @Prop.Set( PropBehavior.array, () => BienInventario ) bienes: BienInventario[] = [];


    constructor( item?: Partial<Inventario> )
    {
        super();
        Prop.initialize( this, item );
    }
}