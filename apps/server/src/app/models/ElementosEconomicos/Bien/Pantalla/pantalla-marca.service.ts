import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PantallaMarca } from '@app/models';
import { AppService } from 'apps/server/src/app/app.service';
import { ERROR_CRUD } from 'apps/server/src/app/interfaces/constants';
import { SessionData } from 'apps/server/src/app/interfaces/interfaces';
import { ConectorService } from 'apps/server/src/app/services/conector.service';
import { SQLBuilder } from 'apps/server/src/app/services/SQLBuilder';

@Injectable()
export class PantallaMarcaService {

    query = `
        select json_object(
            'id', pantalla_marca.id,
            'nombre', pantalla_marca.nombre
        ) as pantallaMarca
        from pantalla_marca
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            pantallaMarca: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new PantallaMarca( s.json.pantallaMarca ) ),
                createItem: s => this.createItem( s, new PantallaMarca( s.json.pantallaMarca ) ),
                updateItem: s => this.updateItem( s, new PantallaMarca( s.json.pantallaMarca ) ),
                deleteItem: s => this.deleteItem( s, new PantallaMarca( s.json.pantallaMarca ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'pantalla_marca' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: PantallaMarca,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, pantallaMarca: PantallaMarca )
    {
        const data = await this.conectorService.executeQuery({
            target: PantallaMarca,
            transaction: s.transaction,
            query: `
                ${this.query}
                where pantalla_marca.id = :id
            `,
            parameters: {
                id: pantallaMarca.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, pantallaMarca: PantallaMarca )
    {
        pantallaMarca.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'pantalla_marca' )
            .values([
                {
                    id: pantallaMarca.id ?? null,
                    nombre: pantallaMarca.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, pantallaMarca )
    }


    async updateItem( s: SessionData, pantallaMarca: PantallaMarca )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'pantalla_marca' )
            .set({
                nombre: pantallaMarca.nombre ?? null,
            })
            .where({
                id: pantallaMarca.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, pantallaMarca )
    }


    async deleteItem( s: SessionData, pantallaMarca: PantallaMarca )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'pantalla_marca' )
            .where({
                id: pantallaMarca.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}