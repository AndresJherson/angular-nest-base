import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PantallaModelo } from '@app/models';
import { AppService } from 'apps/server/src/app/app.service';
import { ERROR_CRUD } from 'apps/server/src/app/interfaces/constants';
import { SessionData } from 'apps/server/src/app/interfaces/interfaces';
import { ConectorService } from 'apps/server/src/app/services/conector.service';
import { SQLBuilder } from 'apps/server/src/app/services/SQLBuilder';

@Injectable()
export class PantallaModeloService {

    query = `
        select json_object(
            'id', pantalla_modelo.id,
            'pantallaMarca', (
                select json_object(
                    'id', pantalla_marca.id,
                    'nombre', pantalla_marca.nombre
                ) as pantallaMarca
                from pantalla_marca
                where pantalla_marca.id = pantalla_modelo.pantalla_marca_id
            ),
            'nombre', pantalla_modelo.nombre
        ) as pantallaModelo
        from pantalla_modelo
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            pantallaModelo: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new PantallaModelo( s.json.pantallaModelo ) ),
                createItem: s => this.createItem( s, new PantallaModelo( s.json.pantallaModelo ) ),
                updateItem: s => this.updateItem( s, new PantallaModelo( s.json.pantallaModelo ) ),
                deleteItem: s => this.deleteItem( s, new PantallaModelo( s.json.pantallaModelo ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'pantalla_modelo' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: PantallaModelo,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, pantallaModelo: PantallaModelo )
    {
        const data = await this.conectorService.executeQuery({
            target: PantallaModelo,
            transaction: s.transaction,
            query: `
                ${this.query}
                where pantalla_modelo.id = :id
            `,
            parameters: {
                id: pantallaModelo.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, pantallaModelo: PantallaModelo )
    {
        pantallaModelo.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'pantalla_modelo' )
            .values([
                {
                    id: pantallaModelo.id ?? null,
                    nombre: pantallaModelo.nombre ?? null,
                    pantalla_marca_id: pantallaModelo.pantallaMarca?.id ?? null
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, pantallaModelo )
    }


    async updateItem( s: SessionData, pantallaModelo: PantallaModelo )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'pantalla_modelo' )
            .set({
                nombre: pantallaModelo.nombre ?? null,
                pantalla_marca_id: pantallaModelo.pantallaMarca?.id ?? null
            })
            .where({
                id: pantallaModelo.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, pantallaModelo )
    }


    async deleteItem( s: SessionData, pantallaModelo: PantallaModelo )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'pantalla_modelo' )
            .where({
                id: pantallaModelo.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}