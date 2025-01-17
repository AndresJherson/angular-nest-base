import { Bien, Prop } from "../../../../index";

@Prop.Class()
export class Producto extends Bien
{
    static override type = 'Producto';
    @Prop.Set() override type: string = Producto.type;


    constructor( json?: Partial<Producto> )
    {
        super();
        Prop.initialize( this, json );
    }
}