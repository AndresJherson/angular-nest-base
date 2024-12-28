import { Bien } from "../Bien";
import { Prop } from "../../../Model";

@Prop.Class()
export class Producto extends Bien
{
    @Prop.Set() override type: string = Producto.name;


    constructor( json?: Partial<Producto> )
    {
        super();
        Prop.initialize( this, json );
    }
}