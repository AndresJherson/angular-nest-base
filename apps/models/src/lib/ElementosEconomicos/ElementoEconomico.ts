import { Model, Prop } from '../../index';

@Prop.Class()
export class ElementoEconomico extends Model
{
    static override type = 'ElementoEconomico';
    @Prop.Set() type: string = ElementoEconomico.type;

    @Prop.Set() uuid?: string;
    @Prop.Set() codigo?: string;
    @Prop.Set() nombre?: string;
    @Prop.Set() magnitudNombre?: string;
    @Prop.Set() categoriaNombre?: string;
    @Prop.Set() precioUnitario: number = 0;
    @Prop.Set() esSalida: boolean = false;


    constructor( item?: Partial<ElementoEconomico> )
    {
        super();
        Prop.initialize( this, item );
    }


    static initialize( data: Partial<ElementoEconomico>[] ): ElementoEconomico[]
    {
        return data.map( item => 
            new (
                Prop.GetClass<ElementoEconomico>( item.type )
                ?? Prop.GetClass( Object.getPrototypeOf( item ) )
                ?? ElementoEconomico
            )( item )
        );
    }
}