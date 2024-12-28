import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { Magnitud } from 'apps/models/src/lib/ElementosEconomicos/Bien/Magnitud';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { AppService } from '../../../app.service';

@Injectable()
export class MagnitudService {


    query = `
        select json_object(
            'id', magnitud.id,
            'nombre', magnitud.nombre,
            'magnitudTipo', (
                select json_object(
                    'id', magnitud_tipo.id,
                    'nombre', magnitud_tipo.nombre
                )
                from magnitud_tipo
                where magnitud_tipo.id = magnitud.magnitud_tipo_id
            )
        ) as magnitud
        from magnitud
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            magnitud: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Magnitud( s.json.magnitud ) ),
                createItem: s => this.createItem( s, new Magnitud( s.json.magnitud ) ),
                updateItem: s => this.updateItem( s, new Magnitud( s.json.magnitud ) ),
                deleteItem: s => this.deleteItem( s, new Magnitud( s.json.magnitud ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'magnitud' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Magnitud,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, magnitud: Magnitud )
    {
        const data = await this.conectorService.executeQuery({
            target: Magnitud,
            transaction: s.transaction,
            query: `
                ${this.query}
                where magnitud.id = :id
            `,
            parameters: {
                id: magnitud.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, magnitud: Magnitud )
    {
        magnitud.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'magnitud' )
            .values([
                {
                    id: magnitud.id ?? null,
                    nombre: magnitud.nombre ?? null,
                    magnitud_tipo_id: magnitud.magnitudTipo?.id ?? null
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, magnitud )
    }


    async updateItem( s: SessionData, magnitud: Magnitud )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'magnitud' )
            .set({
                nombre: magnitud.nombre ?? null,
                magnitud_tipo_id: magnitud.magnitudTipo?.id ?? null
            })
            .where({
                id: magnitud.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, magnitud )
    }


    async deleteItem( s: SessionData, magnitud: Magnitud )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'magnitud' )
            .where({
                id: magnitud.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}