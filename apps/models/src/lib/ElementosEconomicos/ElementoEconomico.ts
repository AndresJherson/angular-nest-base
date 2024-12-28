import { Model, Prop } from "../Model";

@Prop.Class()
export class ElementoEconomico extends Model
{
    @Prop.Set() uuid?: string;
    @Prop.Set() codigo?: string;
    @Prop.Set() nombre?: string;
    @Prop.Set() magnitudNombre?: string;
    @Prop.Set() categoria?: string;
    @Prop.Set() precioUnitario: number = 0;
    @Prop.Set() esSalida: boolean = false;
    @Prop.Set() type: string = ElementoEconomico.name;


    constructor( item?: Partial<ElementoEconomico> )
    {
        super();
        Prop.initialize( this, item );
    }


    static initializeCollection( collection: any[] ): ElementoEconomico[]
    {
        return collection.map( item => 
            new(
                Prop.GetClass<ElementoEconomico>( Object.getPrototypeOf( item ) )
                ?? Prop.GetClass<ElementoEconomico>( item.type )
                ?? ElementoEconomico
            )( item )
        );
    }
}