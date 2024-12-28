import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Calidad } from 'apps/models/src/lib/ElementosEconomicos/Bien/Pantalla/Calidad';
import { AppService } from 'apps/server/src/app/app.service';
import { ERROR_CRUD } from 'apps/server/src/app/interfaces/constants';
import { SessionData } from 'apps/server/src/app/interfaces/interfaces';
import { ConectorService } from 'apps/server/src/app/services/conector.service';
import { SQLBuilder } from 'apps/server/src/app/services/SQLBuilder';

@Injectable()
export class CalidadService {

    query = `
        select json_object(
            'id', calidad.id,
            'nombre', calidad.nombre
        ) as calidad
        from calidad
    `;


    service: Record<string, Record<string, ( s: SessionData ) => Promise<any>> > = {
        
    }


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            calidad: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Calidad( s.json.calidad ) ),
                createItem: s => this.createItem( s, new Calidad( s.json.calidad ) ),
                updateItem: s => this.updateItem( s, new Calidad( s.json.calidad ) ),
                deleteItem: s => this.deleteItem( s, new Calidad( s.json.calidad ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'calidad' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Calidad,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, calidad: Calidad )
    {
        const data = await this.conectorService.executeQuery({
            target: Calidad,
            transaction: s.transaction,
            query: `
                ${this.query}
                where calidad.id = :id
            `,
            parameters: {
                id: calidad.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, calidad: Calidad )
    {
        calidad.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'calidad' )
            .values([
                {
                    id: calidad.id ?? null,
                    nombre: calidad.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, calidad )
    }


    async updateItem( s: SessionData, calidad: Calidad )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'calidad' )
            .set({
                nombre: calidad.nombre ?? null,
            })
            .where({
                id: calidad.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, calidad )
    }


    async deleteItem( s: SessionData, calidad: Calidad )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'calidad' )
            .where({
                id: calidad.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
