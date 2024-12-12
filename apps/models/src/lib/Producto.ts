import { Bien } from "./Bien";
import { Prop } from "./Model";

export class Producto extends Bien
{
    static type = "Producto";
    @Prop.Set() declare esSalida?: boolean;


    constructor( json?: any )
    {
        super();
        Prop.initialize( this, json );
    }
}