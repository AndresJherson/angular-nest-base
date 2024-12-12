import 'reflect-metadata';
import Decimal from 'decimal.js';
import { DateTime, Duration } from 'luxon';

export enum PropBehavior
{
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    time = 'time',
    date = 'date',
    datetime = 'datetime',
    object = 'object',
    model = 'model',
    array = 'array'
}

export class Prop
{
    private static recordMetadata = new Map<string, TypeInfo>();

    static Set( behavior?: PropBehavior, getModel?: () => new ( ...args: any[] ) => Model ): PropertyDecorator
    {
        return ( target: any, propertyKey ) => {

            const constructorName = target.prototype?.constructor.name ?? target.constructor.name;
            const propertyType = Reflect.getMetadata( 'design:type', target, propertyKey );
            const newBehavior = behavior ?? String( propertyType.name ).toLowerCase();

            const propertyInfo: ProperyInfo<any> = {
                name: propertyKey.toString(),
                model: getModel ?? ( () => Object ),
                behavior: newBehavior
            };

            const typeInfo: TypeInfo = this.GetTypeInfo( target ) ?? {
                name: constructorName,
                recordPropertyInfo: {}
            };

            typeInfo.recordPropertyInfo[ propertyKey.toString() ] = propertyInfo;

            Prop.recordMetadata.set( constructorName, typeInfo );

        }
    }


    static initialize( target: NonNullable<Object>, json?: any )
    {
        if ( json === null || json === undefined ) return;

        let prototype = Object.getPrototypeOf( target );
        const initializedProperties = new Set<string>();

        while ( prototype && Object.prototype !== prototype ) {

            const typeInfo = Prop.GetTypeInfo( prototype );

            Object.entries( typeInfo?.recordPropertyInfo ?? {} ).forEach( ([ propertyName, propertyInfo ]) => {

                const value = json[propertyName];
                const behavior = propertyInfo.behavior;
                const model = propertyInfo.model();

                if ( initializedProperties.has( propertyName ) ) return;
                if ( value === undefined || value === null ) return;

                if ( behavior === PropBehavior.string ) {
                    Reflect.set( target, propertyName, Prop.setString( value ) );
                }
                else if ( behavior === PropBehavior.number ) {
                    Reflect.set( target, propertyName, Prop.setNumber( value ) );
                }
                else if ( behavior === PropBehavior.boolean ) {
                    Reflect.set( target, propertyName, Boolean( value ) );
                }
                else if ( behavior === PropBehavior.model ) {
                    Reflect.set( target, propertyName, new model( value ) );
                }
                else if ( behavior === PropBehavior.array ) {
                    Reflect.set(
                        target, 
                        propertyName, 
                        Array.isArray( value )
                            ? value.map( item => new model( item ) )
                            : []
                    );
                }
                else if ( behavior === PropBehavior.date ) {
                    Reflect.set( target, propertyName, Prop.setDate( value ) );
                }
                else if ( behavior === PropBehavior.time ) {
                    Reflect.set( target, propertyName, Prop.setTime( value ) );
                }
                else if ( behavior === PropBehavior.datetime ) {
                    Reflect.set( target, propertyName, Prop.setDateTime( value ) );
                }
                else if ( behavior === PropBehavior.object ) {
                    Reflect.set( target, propertyName, value );
                }
                else {
                    Reflect.set( target, propertyName, value );
                }
                // Se podrán añadir más condicionales según se requiera el proyecto

                initializedProperties.add( propertyName );

            } );

            prototype = Object.getPrototypeOf( prototype );

        }
        console.log( 'initilize:', target )
    }


    static GetTypeInfo( target: any ): TypeInfo | undefined
    {
        const constructorName = target.prototype?.constructor.name ?? target.constructor.name;
        return this.recordMetadata.get( constructorName );
    }


    static toDateTime( value: string )
    {
        try {
            const datetime = DateTime.fromSQL(value, { zone: 'local', locale: 'system' });
            return datetime.isValid ? datetime : DateTime.invalid('Inválido');
        }
        catch ( error: any ) {
            return DateTime.invalid( 'Inválido' );
        }
    }


    static toDuration( value: string )
    {
        try {
            const [hours,minutes,seconds] = value.split( ':' ).map( Number );
            return Duration.fromObject({ hours, minutes, seconds });
        }
        catch ( error ) {
            return Duration.invalid( 'Inválido' );
        }
    }


    static toDecimal( value?: number | string )
    {
        if ( value === undefined ) return undefined;

        try {
            return new Decimal( value );
        }
        catch ( error ) {
            return undefined;
        }
    }


    static setDate( value: any )
    {
        const datetime = Prop.toDateTime( value );
        return datetime.isValid ? datetime.toSQLDate() : undefined;
        
    }


    static setDateTime( value: any )
    {
        const datetime = Prop.toDateTime( value );
        return datetime.isValid ? datetime.toSQL() : undefined;
    }


    static setTime( value: any )
    {
        const duration = Prop.toDuration( value );
        return duration.isValid ? duration.toFormat( 'hh:mm:ss' ) : undefined;
    }


    static setNumber( value: any )
    {
        try {
            const decimalValue = new Decimal( value );
            return decimalValue.isNaN() ? undefined : decimalValue.toNumber();
        } catch ( error ) {
            return value;
        }
    }


    static setNumberStrict( value: any )
    {
        try {
            const decimalValue = new Decimal( value );
            return decimalValue.isNaN() ? undefined : decimalValue.toNumber();
        } catch ( error ) {
            return undefined;
        }
    }


    static setString( value: any )
    {
        if ( value === undefined || value === null ) return undefined;

        const newValue = String( value ).trim();

        return newValue.length === 0 ? undefined : newValue;
    }
}

export interface TypeInfo
{
    name: string,
    recordPropertyInfo: Record<string, ProperyInfo<any>>
}

export interface ProperyInfo<T>
{
    name: keyof T,
    model: () => new ( ...args: any[] ) => T,
    behavior: string,
}


export class Model
{
    @Prop.Set() symbol: symbol = Symbol();
    @Prop.Set() id?: number;


    constructor( json?: any )
    {
        Prop.initialize( this, json );
    }

    public checkProperties2send()
    {}
}