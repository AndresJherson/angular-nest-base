import Decimal from "decimal.js";
import { Model, MovimientoPantalla, PantallaModeloCalidad, Prop, PropBehavior } from '../../../index';
import { ErrorModel } from "../../utils/ErrorModel";

@Prop.Class()
export class MovimientoPantallaDetalle extends Model
{
    static override type = 'MovimientoPantallaDetalle';
    @Prop.Set( PropBehavior.model, () => MovimientoPantalla ) documentoMovimiento?: MovimientoPantalla;
    @Prop.Set( PropBehavior.model, () => PantallaModeloCalidad ) pantallaModeloCalidad?: PantallaModeloCalidad;
    @Prop.Set() cantidad: number = 0;
    @Prop.Set() importeUnitario: number = 0;
    @Prop.Set() importeNeto: number = 0;
    @Prop.Set() type: string = MovimientoPantallaDetalle.type;


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


    static initialize( data: Partial<MovimientoPantallaDetalle>[] ): MovimientoPantallaDetalle[]
    {
        return data.map( item => 
            new (
                Prop.GetClass<MovimientoPantallaDetalle>( item.type )
                ?? Prop.GetClass( Object.getPrototypeOf( item ) )
                ?? MovimientoPantallaDetalle
            )( item )
        );
    }
}