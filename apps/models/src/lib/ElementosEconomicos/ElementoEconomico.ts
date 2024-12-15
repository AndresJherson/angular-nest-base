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
    @Prop.Set() type: string = ElementoEconomico.name;


    constructor( json?: Partial<ElementoEconomico> )
    {
        super();
        Prop.initialize( this, json );
    }
}