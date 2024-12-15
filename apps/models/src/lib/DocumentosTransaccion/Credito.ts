import Decimal from "decimal.js";
import { Prop, PropBehavior } from "../Model";
import { Cliente } from "../Personas/Cliente";
import { DocumentoIdentificacion } from "../Personas/DocumentoIdentificacion";
import { Proporcion, TipoProporcion } from "../utils/Proporcion";
import { Cuota } from "./Cuota";
import { DocumentoTransaccion } from "./DocumentoTransaccion";
import { DateTime, Interval } from "luxon";
import { ErrorModel } from "../utils/ErrorModel";

export class Credito extends DocumentoTransaccion
{
    @Prop.Set( PropBehavior.model, () => Cliente ) cliente?: Cliente;
    @Prop.Set( PropBehavior.model, () => DocumentoIdentificacion ) receptorDocumentoIdentificacion?: DocumentoIdentificacion;
    @Prop.Set() receptorCodigo?: string;
    @Prop.Set() receptorNombre?: string;
    @Prop.Set() receptorCelular?: number;
    
    @Prop.Set() tasaInteresDiario: number = 0;
    @Prop.Set() importeCapitalInicial:number = 0;
    @Prop.Set() importeInteres: number = 0;
    @Prop.Set() importeCapitalFinal:number = 0;

    @Prop.Set( PropBehavior.array, () => Cuota ) cuotas: Cuota[] = [];

    @Prop.Set() duracionMinutos: number = 0;
    @Prop.Set() interesXminuto = new Proporcion( TipoProporcion.directa, 0, 0 );
    @Prop.Set() amortizacionXminuto = new Proporcion( TipoProporcion.directa, 0, 0 );
    @Prop.Set() cuotaXminuto = new Proporcion( TipoProporcion.directa, 0, 0 );


    constructor( json?: Partial<Credito> )
    {
        super();
        Prop.initialize( this, json );
    }


    agregarCuota( cuota: Cuota ): this
    {
        cuota.fechaInicio = this.cuotas.length === 0
                            ? ( cuota.fechaInicio ?? DateTime.local().toSQL() )
                            : ( cuota.fechaInicio ?? this.cuotas[ this.cuotas.length - 1 ].fechaVencimiento );

        this.cuotas.push( cuota );

        this.calcularInformacionTransaccion();
        
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
            this.calcularInformacionTransaccion();
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

        this.calcularInformacionTransaccion();

        return this;
    }


    calcularCuotas(): this
    {   
        try {

            this.duracionMinutos = this.cuotas.reduce(
    
                ( minuto, cuota, i ) => {
                    
                    cuota.numero = i + 1;
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
    
    
    
            let saldo = this.importeCapitalInicial;
    
            this.cuotas.forEach( ( cuota, i ) => {
    
                cuota.importeAmortizacion = this.amortizacionXminuto.calcularAntecedente( cuota.duracionMinutos ?? 0 )
                                            .toDecimalPlaces( 2 )
                                            .toNumber();
                                            
                cuota.importeInteres = this.interesXminuto.calcularAntecedente( cuota.duracionMinutos ?? 0 )
                                        .toDecimalPlaces( 2 )
                                        .toNumber();
    
                cuota.importeCuota = this.cuotaXminuto.calcularAntecedente( cuota.duracionMinutos ?? 0 )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();
    
                const decimalSaldo = new Decimal( saldo ?? 0 )
                                    .minus( cuota.importeCuota )
                                    .toNumber();
                
                saldo = decimalSaldo > 0
                        ? decimalSaldo
                        : 0;
    
                cuota.importeSaldo = saldo;
                cuota.importeMora = 0;
    
                if ( !cuota.esActivoMora ) return;
                
                const interval = Interval.fromDateTimes( Prop.toDateTime( cuota.fechaVencimiento ), Prop.toDateTime( cuota.fechaLimiteMora ) );
                const minutos = interval.isValid
                                ? interval.toDuration().minutes
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


    override calcularInformacionTransaccion(): this 
    {
        try {

            this.calcularCuotas();

            this.importeInteres = this.interesXminuto.calcularAntecedente( this.duracionMinutos )
                                .toDecimalPlaces( 2 )
                                .toNumber();

            this.importeCapitalFinal = new Decimal( this.importeCapitalInicial )
                                    .plus( this.importeInteres )
                                    .toDecimalPlaces( 2 )
                                    .toNumber();
        }
        catch ( error ) {
            throw new ErrorModel( 'Error al calcular información del crédito', error );
        }

        return this;
    }


    override calcularInformacionEfectivo(): this 
    {
        try {

            super.calcularInformacionEfectivo();
            
            let importeCobrado = this.importeCobrado;

            this.cuotas.forEach( cuota => {

                if ( cuota.importeCuota === undefined ) {

                    cuota.importeCobrado = 0;
                    cuota.importePorCobrar = 0;
                    cuota.porcentajeCobrado = 0;
                    cuota.porcentajePorCobrar = 0;
                    return;
                    
                }

                const decimalImporteCobrado = new Decimal( importeCobrado );
                importeCobrado = decimalImporteCobrado
                                .minus( cuota.importeCuota )
                                .toNumber();

                if ( importeCobrado > 0 ) {
                    
                    cuota.importeCobrado = cuota.importeCuota;
                    cuota.importePorCobrar = 0;
                    cuota.porcentajeCobrado = 100.00;
                    cuota.porcentajePorCobrar = 0;

                }
                else {

                    cuota.importeCobrado = decimalImporteCobrado
                                            .toDecimalPlaces( 2 )
                                            .toNumber();

                    cuota.importePorCobrar = new Decimal( cuota.importeCuota )
                                            .minus( decimalImporteCobrado )
                                            .toDecimalPlaces( 2 )
                                            .toNumber();

                    try {
                        cuota.porcentajeCobrado = decimalImporteCobrado
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