import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {QueryTypes, Sequelize, Transaction} from 'sequelize';
import { Prop } from '../../../../models/src/lib/Model';

@Injectable()
export class ConectorService {

    private sequelize: Sequelize;

    constructor()
    {
        this.sequelize = new Sequelize(
            'servicio_tecnico',
            'root',
            'root123',
            {
                host: 'localhost',
                dialect: 'mysql',
                port: 3306
            }
        );
    }


    async transaction()
    {
        return await this.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          });
    }


    async getId( t: Transaction, table: string )
    {
        const data: any[] = await this.sequelize.query(
            `select max( id ) as id from ${table}`,
            { 
                transaction: t,
                type: QueryTypes.SELECT
            } 
        );

        const id = Prop.setNumberStrict( data[ 0 ]?.id );
        return id !== undefined
                ? id + 1
                : 1;
    }


    async executeQuery<T>( parameter: ParameterExecuteQuery<T>  ): Promise<T[]>
    {
        try {

            const data = await this.sequelize.query( parameter.query, {
                replacements: parameter.parameters,
                transaction: parameter.transaction,
                type: QueryTypes.SELECT,
            } );

            if ( parameter.target ) {
                const propertyName = Object.keys( data[ 0 ] ?? {} )[ 0 ];
                let newData: T[] = [];

                for ( const item of data ) {
                    newData.push( new parameter.target( ( item as any )[ propertyName ] ) );
                }

                return newData;
            }

            return data as T[];
        }
        catch ( error: any ) {
            console.log( error );
            throw new InternalServerErrorException( 'Error en la lectura de datos.' );
        }
    }


    async executeNonQuery( parameter: ParameterExecuteNonQuery ): Promise<number>
    {
        try {

            const [ data, metadata ]: [ any, any ] = await this.sequelize.query( parameter.query, {
                replacements: parameter.parameters,
                transaction: parameter.transaction
            } );

            return metadata?.affectedRows ?? metadata;
        }
        catch ( error: any ) {
            console.log( error );
            throw new InternalServerErrorException( 'Error en la escritura de datos.' );
        }
    }
}


export interface ParameterExecuteQuery<T>
{
    target?: new ( json?: any ) => T,
    transaction: Transaction,
    query: string,
    parameters?: Record<string,any>,
}

export interface ParameterExecuteNonQuery
{
    transaction: Transaction,
    query: string,
    parameters?: Record<string,any>,
}

export interface HttpResponseNonQuery
{
    affectedRows: number
}