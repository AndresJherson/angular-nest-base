import { Model, Prop } from "./Model";

export class ElementoEconomico extends Model
{
    @Prop.Set() uuid?: string;
    @Prop.Set() codigo?: string;
    
    @Prop.Set() nombre?: string;
    @Prop.Set() magnitudNombre?: string;
    @Prop.Set() categoria?: string;
    @Prop.Set() precioUnitario?: number;
    @Prop.Set() type?: string;


    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    }
}