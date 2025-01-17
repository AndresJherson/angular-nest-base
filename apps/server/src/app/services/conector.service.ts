import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {QueryTypes, Sequelize, Transaction} from 'sequelize';
import { Model, Prop } from '@app/models';
import { spawn } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';

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

            const data: any[] = await this.sequelize.query( parameter.query, {
                replacements: parameter.parameters,
                transaction: parameter.transaction,
                type: QueryTypes.SELECT,
            } );

            if ( parameter.target === undefined ) return data;


            const columnName = Object.keys( data[ 0 ] ?? {} )[ 0 ];
            let newData: T[] = [];

            if ( parameter.target?.prototype ) {

                for ( const item of data ) {
                    newData.push( new ( parameter.target as new(...args:any[])=>T )( item[ columnName ] ) );
                }

            }
            else {
                
                const arrayJson = data.map( item => item[ columnName ] );
                
                newData = ( parameter.target as (...args:any[])=>T[] )( arrayJson );
            }
            console.log( newData );
            return newData;
            

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


    runPythonScript<T>( scriptPath: string, data: Record<any,any> ): Promise<T>
    {
        return new Promise<T>( ( resolve, reject ) => {
            const pythonProcess = spawn( 'python', [ scriptPath ] );
        
            let output = '';
            let error = '';
        
            pythonProcess.stdout.on( 'data', data => {
                output += data.toString();
            });
        
            pythonProcess.stderr.on( 'data', data => {
                error += data.toString();
            });
        
            pythonProcess.on( 'close', code => {
                if ( code === 0 ) {
                    resolve( JSON.parse( output ) );
                } else {
                    reject( new Error( error ) );
                }
            });

            pythonProcess.stdin.write( JSON.stringify( data ) );
            pythonProcess.stdin.end();
        });
    };
}


export interface ParameterExecuteQuery<T>
{
    target?: ( new ( ...args: any[] ) => T ) | ( ( ...args: any[] ) => T[] ),
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