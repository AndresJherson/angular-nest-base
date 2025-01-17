import { Interval } from "luxon";
import { Credito, Model, Prop, PropBehavior } from '../../index';
import { ErrorModel } from "../utils/ErrorModel";

@Prop.Class()
export class Cuota extends Model
{
    static override type = 'Cuota';
    @Prop.Set() type: string = Cuota.type;

    @Prop.Set( PropBehavior.model, () => Credito ) credito?: Credito;

    @Prop.Set() numero: number = 0;
    @Prop.Set( PropBehavior.datetime ) fechaInicio?: string;
    @Prop.Set( PropBehavior.datetime ) fechaVencimiento?: string;
    @Prop.Set() duracionMinutos: number = 0;

    @Prop.Set() importeInteres: number = 0;
    @Prop.Set() importeAmortizacion: number = 0;
    @Prop.Set() importeCuota: number = 0;
    @Prop.Set() importeSaldo: number = 0;

    @Prop.Set() esActivoMora: boolean = false;
    @Prop.Set( PropBehavior.datetime ) fechaLimiteMora?: string;
    @Prop.Set() importeMora: number = 0;

    @Prop.Set() importeCobrado: number = 0;
    @Prop.Set() importePorCobrar: number = 0;
    @Prop.Set() porcentajeCobrado: number = 0;
    @Prop.Set() porcentajePorCobrar: number = 0;


    constructor( json?: Partial<Cuota> )
    {
        super();
        Prop.initialize( this, json );
    }


    calcularDuracion(): this
    {
        try {

            const dateTimeInicio = Prop.toDateTime( this.fechaInicio );
            const dateTimeFinal = Prop.toDateTime( this.fechaVencimiento );
            const interval = Interval.fromDateTimes( dateTimeInicio, dateTimeFinal );             

            this.duracionMinutos = interval.isValid
                                    ? interval.length( 'minutes' )
                                    : 0;
            
        }
        catch ( error ) {
            throw new ErrorModel( `Error al calcular cuota Nº ${this.numero}`, error );
        }

        return this;
    }
}