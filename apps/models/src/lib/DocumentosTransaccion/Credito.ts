import Decimal from "decimal.js";
import { Cliente, Cuota, DocumentoIdentificacion, DocumentoTransaccion, Prop, PropBehavior } from '../../index';
import { Proporcion, TipoProporcion } from "../utils/Proporcion";
import { Interval } from "luxon";
import { ErrorModel } from "../utils/ErrorModel";

@Prop.Class()
export class Credito extends DocumentoTransaccion
{
    static override type = 'Credito';
    @Prop.Set() override type: string = Credito.type;

    @Prop.Set( PropBehavior.model, () => Cliente ) cliente?: Cliente;
    @Prop.Set( PropBehavior.model, () => DocumentoIdentificacion ) receptorDocumentoIdentificacion?: DocumentoIdentificacion;
    @Prop.Set() receptorCodigo?: string;
    @Prop.Set() receptorNombre?: string;
    @Prop.Set() receptorCelular?: number;
    
    @Prop.Set() tasaInteresDiario: number = 0;
    @Prop.Set() importeCapitalInicial:number = 0;
    @Prop.Set() importeInteres: number = 0;
    @Prop.Set() porcentajeInteres: number = 0;
    @Prop.Set() importeCapitalFinal:number = 0;

    @Prop.Set( PropBehavior.array, () => Cuota ) cuotas: Cuota[] = [];

    @Prop.Set() duracionMinutos: number = 0;
    interesXminuto = new Proporcion( TipoProporcion.directa, 0, 0 );
    amortizacionXminuto = new Proporcion( TipoProporcion.directa, 0, 0 );
    cuotaXminuto = new Proporcion( TipoProporcion.directa, 0, 0 );
    

    constructor( json?: Partial<Credito> )
    {
        super();
        Prop.initialize( this, json );
    }


    agregarCuota( cuota: Cuota ): this
    {
        cuota.fechaInicio = this.cuotas.length === 0
                            ? ( cuota.fechaInicio ?? Prop.toDateTimeNow().toSQL() )
                            : ( cuota.fechaInicio ?? this.cuotas[ this.cuotas.length - 1 ].fechaVencimiento );

        this.cuotas.push( cuota );

        this.procesarInformacionTransaccion();
        
        return this;
    }


    actualizarCuota( cuota: Cuota ): this
    {
        let i = this.cuotas.findIndex( c => c.symbol === cuota.symbol );

        i = i === -1
            ? this.cuotas.findIndex( c => 
                ( c.id === undefined || cuota.id === undefined )
                ? false
                : ( c.id === cuota.id )
            )
            : i;

        if ( i !== -1 ) {
            this.cuotas[ i ] = cuota;
            this.procesarInformacionTransaccion();
        }


        return this;
    }


    eliminarCuota( cuota: Cuota ): this
    {
        this.cuotas = this.cuotas.filter( c => c.symbol !== cuota.symbol );
        this.cuotas = this.cuotas.filter( c => 
            ( c.id === undefined || cuota.id === undefined )
            ? true
            : ( c.id !== cuota.id )
        );

        this.procesarInformacionTransaccion();

        return this;
    }


    calcularCuotas(): this
    {
        try {
            this.cuotas.forEach( ( cuota, i ) => {
    
                cuota.importeAmortizacion = this.amortizacionXminuto.calcularAntecedente( cuota.duracionMinutos )
                                            .toDecimalPlaces( 2 )            
                                            .toNumber();
                                            
                cuota.importeInteres = this.interesXminuto.calcularAntecedente( cuota.duracionMinutos )
                                        .toDecimalPlaces( 2 )
                                        .toNumber();

                cuota.importeCuota = new Decimal( cuota.importeAmortizacion )
                                    .plus( cuota.importeInteres )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();
    
                cuota.importeSaldo = i === 0
                                    ? new Decimal( this.importeCapitalInicial )
                                        .minus( cuota.importeAmortizacion )
                                        .toDecimalPlaces( 2 )
                                        .toNumber()
                                    : new Decimal( this.cuotas[ i - 1 ].importeSaldo )
                                        .minus( cuota.importeAmortizacion )
                                        .toDecimalPlaces( 2 )
                                        .toNumber();
                        
                cuota.importeMora = 0;

    
                if ( !cuota.esActivoMora ) return;
                
                const interval = Interval.fromDateTimes( Prop.toDateTime( cuota.fechaVencimiento ), Prop.toDateTime( cuota.fechaLimiteMora ) );
                const minutos = interval.isValid
                                ? interval.length( 'minutes' )
                                : 0;
    
                cuota.importeMora = this.interesXminuto.calcularAntecedente( minutos )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();
    
            } );
        }
        catch ( error ) {
            throw new ErrorModel( 'Error al calcular cuotas', error );
        }

        return this;
    }


    override procesarInformacionTransaccion(): this
    {   
        try {

            super.procesarInformacionTransaccion();

            this.duracionMinutos = this.cuotas.reduce(
    
                ( minuto, cuota, i ) => {
                    
                    cuota.numero = i + 1;

                    cuota.fechaInicio = i === 0
                                        ? cuota.fechaInicio
                                        : this.cuotas[ i - 1 ].fechaVencimiento;

                    return minuto.plus( cuota.calcularDuracion().duracionMinutos )
    
                },
                new Decimal( 0 )
    
            )
            .toDecimalPlaces( 2 )
            .toNumber();
    
    
            try {
                this.interesXminuto.antecedente = new Decimal( this.tasaInteresDiario )
                                                    .div( 1440 )
                                                    .div( 100 )
                                                    .mul( this.importeCapitalInicial )
                                                    .toNumber();
    
                this.interesXminuto.consecuente = 1;
            }
            catch ( error ) {
                this.interesXminuto.antecedente = 0;
                this.interesXminuto.consecuente = 0;
            }
    
    
            try {
                this.amortizacionXminuto.antecedente = new Decimal( this.importeCapitalInicial )
                                                        .div( this.duracionMinutos )
                                                        .toNumber();
    
                this.amortizacionXminuto.consecuente = 1;
            }
            catch ( error ) {
                this.amortizacionXminuto.antecedente = 0;
                this.amortizacionXminuto.consecuente = 0;
            }
    
    
            this.cuotaXminuto.antecedente = new Decimal( this.amortizacionXminuto.antecedente )
                                            .plus( this.interesXminuto.antecedente )
                                            .toNumber();
            this.cuotaXminuto.consecuente = 1;
    
    
            this.importeInteres = this.interesXminuto.calcularAntecedente( this.duracionMinutos )
                                .toDecimalPlaces( 2 )
                                .toNumber();

            this.porcentajeInteres = new Decimal( this.importeInteres )
                                        .div( this.importeCapitalInicial )
                                        .mul( 100 )
                                        .toDecimalPlaces( 2 )
                                        .toNumber();

            this.importeCapitalFinal = new Decimal( this.importeCapitalInicial )
                                    .plus( this.importeInteres )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();
    
            this.calcularCuotas();

            const cuotasLength = this.cuotas.length;
            const ultimaCuota = this.cuotas[ cuotasLength - 1 ];
            if ( cuotasLength > 1 && ultimaCuota.importeSaldo !== 0 ) {
                
                ultimaCuota.importeAmortizacion = this.cuotas[ cuotasLength - 2 ].importeSaldo;
                ultimaCuota.importeCuota = new Decimal( ultimaCuota.importeAmortizacion )
                                            .plus( ultimaCuota.importeInteres )
                                            .toDecimalPlaces( 2 )
                                            .toNumber();
                ultimaCuota.importeSaldo = 0;

            }


        }
        catch ( error ) {
            console.log( error );
            throw new ErrorModel( 'Error al calcular el credito', error );
        }


        return this;
    }


    override procesarInformacionMovimiento(): this 
    {
        try {

            super.procesarInformacionMovimiento();
            
            let saldoCobrado = this.importeCobrado;

            this.cuotas.forEach( cuota => {

                const decimalSaldoCobrado = new Decimal( saldoCobrado );
                saldoCobrado = decimalSaldoCobrado
                                .minus( cuota.importeCuota )
                                .toNumber();

                if ( saldoCobrado > 0 ) {
                    
                    cuota.importeCobrado = cuota.importeCuota;
                    cuota.importePorCobrar = 0;
                    cuota.porcentajeCobrado = 100.00;
                    cuota.porcentajePorCobrar = 0.00;

                }
                else {

                    cuota.importeCobrado = decimalSaldoCobrado
                                            .toDecimalPlaces( 2 )
                                            .toNumber();

                    cuota.importePorCobrar = new Decimal( cuota.importeCuota )
                                            .minus( decimalSaldoCobrado )
                                            .toDecimalPlaces( 2 )
                                            .toNumber();

                    try {
                        cuota.porcentajeCobrado = decimalSaldoCobrado
                                                    .div( cuota.importeCuota )
                                                    .mul( 100 )
                                                    .toDecimalPlaces( 2 )
                                                    .toNumber();
                            
                        cuota.porcentajePorCobrar = new Decimal( 100.00 )
                                                .minus( cuota.porcentajeCobrado )
                                                .toDecimalPlaces( 2 )
                                                .toNumber();

                    }
                    catch ( error ) {
                        cuota.porcentajeCobrado = 0;
                        cuota.porcentajePorCobrar = 0;
                    }

                }

            } );
            
        }
        catch ( error: any ) {
            throw new ErrorModel( 'Error al calcular importes cobrados del Crédito', error );
        }

        return this;
    }
}