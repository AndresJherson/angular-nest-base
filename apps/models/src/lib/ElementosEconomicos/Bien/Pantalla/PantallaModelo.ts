import { Model, PantallaMarca, Prop, PropBehavior } from "../../../../index";

@Prop.Class()
export class PantallaModelo extends Model
{
    static override type = 'PantallaModelo';
    @Prop.Set() nombre?: string;
    @Prop.Set( PropBehavior.model, () => PantallaMarca ) pantallaMarca?: PantallaMarca;
    

    constructor( json?: Partial<PantallaModelo> )
    {
        super();
        Prop.initialize( this, json );
    }
}