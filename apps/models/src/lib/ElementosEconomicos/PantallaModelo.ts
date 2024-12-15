import { Model, Prop, PropBehavior } from "../Model";
import { PantallaMarca } from "./PantallaMarca";

@Prop.Class()
export class PantallaModelo extends Model
{
    @Prop.Set() nombre?: string;
    @Prop.Set( PropBehavior.model, () => PantallaMarca ) pantallaMarca?: PantallaMarca;
    

    constructor( json?: Partial<PantallaModelo> )
    {
        super();
        Prop.initialize( this, json );
    }
}