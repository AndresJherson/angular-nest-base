import { Model, Prop, PropBehavior } from "./Model";

export class Usuario extends Model
{
    @Prop.Set() nombre?: string;
    @Prop.Set() usuario?: string;
    @Prop.Set() contrasena?: string;
    @Prop.Set() esActivo?: boolean;

    
    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    }
}
