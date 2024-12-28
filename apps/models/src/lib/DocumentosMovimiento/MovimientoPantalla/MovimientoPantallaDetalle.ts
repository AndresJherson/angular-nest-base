import Decimal from "decimal.js";
import { PantallaModeloCalidad } from "../../ElementosEconomicos/Bien/Pantalla/PantallaModeloCalidad";
import { Model, Prop, PropBehavior } from "../../Model";
import { MovimientoPantalla } from "./MovimientoPantalla";
import { ErrorModel } from "../../utils/ErrorModel";

@Prop.Class()
export class MovimientoPantallaDetalle extends Model
{
    @Prop.Set( PropBehavior.model, () => MovimientoPantalla ) documentoMovimiento?: MovimientoPantalla;
    @Prop.Set( PropBehavior.model, () => PantallaModeloCalidad ) pantallaModeloCalidad?: PantallaModeloCalidad;
    @Prop.Set() cantidad: number = 0;
    @Prop.Set() importeUnitario: number = 0;
    @Prop.Set() importeNeto: number = 0;


    constructor( json?: Partial<MovimientoPantallaDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }


    calcularImportes(): this
    {
        try {
            this.importeNeto = new Decimal( this.cantidad )
                                .mul( this.importeUnitario )
                                .toNumber();
            return this;
        }
        catch ( error ) {
            throw new ErrorModel( 'Error en el cálculo de valor total de los detalles de Movimiento de Pantallas', error );
        }
    }
}