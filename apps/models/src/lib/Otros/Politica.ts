import { Model, Prop } from "../../index";

export class Politica extends Model
{
    static override type = 'Politica';
    @Prop.Set() descripcion?: string;
    @Prop.Set() esActivo: number = 1;

    constructor( json?: Partial<Politica> )
    {
        super();
        Prop.initialize( this, json );
    }
}