import Decimal from "decimal.js";
import { Prop, PropBehavior } from "../Model";
import { DocumentoMovimiento } from "./DocumentoMovimiento";
import { MovimientoProductoDetalle } from "./MovimientoProductoDetalle";
import { ErrorModel } from "../utils/ErrorModel";

@Prop.Class()
export class MovimientoProducto extends DocumentoMovimiento
{
    @Prop.Set( PropBehavior.array, () => MovimientoProductoDetalle ) detalles: MovimientoProductoDetalle[] = [];
    @Prop.Set() override type = MovimientoProducto.name;


    constructor( json?: Partial<MovimientoProducto> )
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
            throw new ErrorModel( 'Error en el cálculo de valor total de Documento de Movimiento de Producto.', error );
        }
    }
}