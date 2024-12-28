import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { MagnitudTipo } from 'apps/models/src/lib/ElementosEconomicos/Bien/MagnitudTipo';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { AppService } from '../../../app.service';

@Injectable()
export class MagnitudTipoService {

    query = `
        select json_object(
            'id', magnitud_tipo.id,
            'nombre', magnitud_tipo.nombre
        ) as magnitudTipo
        from magnitud_tipo
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            magnitudTipo: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new MagnitudTipo( s.json.magnitudTipo ) ),
                createItem: s => this.createItem( s, new MagnitudTipo( s.json.magnitudTipo ) ),
                updateItem: s => this.updateItem( s, new MagnitudTipo( s.json.magnitudTipo ) ),
                deleteItem: s => this.deleteItem( s, new MagnitudTipo( s.json.magnitudTipo ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'magnitud_tipo' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: MagnitudTipo,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, magnitudTipo: MagnitudTipo )
    {
        const data = await this.conectorService.executeQuery({
            target: MagnitudTipo,
            transaction: s.transaction,
            query: `
                ${this.query}
                where magnitud_tipo.id = :id
            `,
            parameters: {
                id: magnitudTipo.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, magnitudTipo: MagnitudTipo )
    {
        magnitudTipo.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'magnitud_tipo' )
            .values([
                {
                    id: magnitudTipo.id ?? null,
                    nombre: magnitudTipo.nombre ?? null
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, magnitudTipo )
    }


    async updateItem( s: SessionData, magnitudTipo: MagnitudTipo )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'magnitud_tipo' )
            .set({
                nombre: magnitudTipo.nombre ?? null
            })
            .where({
                id: magnitudTipo.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, magnitudTipo )
    }


    async deleteItem( s: SessionData, magnitudTipo: MagnitudTipo )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'magnitud_tipo' )
            .where({
                id: magnitudTipo.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
