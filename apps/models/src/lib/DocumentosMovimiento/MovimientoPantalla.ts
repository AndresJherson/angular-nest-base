import Decimal from "decimal.js";
import { Prop, PropBehavior } from "../Model";
import { DocumentoMovimiento } from "./DocumentoMovimiento";
import { MovimientoPantallaDetalle } from "./MovimientoPantallaDetalle";
import { ErrorModel } from "../utils/ErrorModel";

@Prop.Class()
export class MovimientoPantalla extends DocumentoMovimiento
{
    @Prop.Set( PropBehavior.array, () => MovimientoPantallaDetalle ) detalles: MovimientoPantallaDetalle[] = [];
    @Prop.Set() override type: string = MovimientoPantalla.name;
    

    constructor( json?: Partial<MovimientoPantalla> )
    {
        super();
        Prop.initialize( this, json );
    }

    override calcularImportes(): this 
    {
        try {
            this.importeNeto = this.detalles.reduce( 
                ( prev, curr ) => prev.plus( curr.calcularImportes().importeNeto ), 
                new Decimal( 0 ) 
            )
            .toNumber();

            return this;
        }
        catch ( error: any ) {
            throw new ErrorModel( 'Error en el cálculo de valor total de Documento de Movimiento de Pantalla', error );
        }
    }
}