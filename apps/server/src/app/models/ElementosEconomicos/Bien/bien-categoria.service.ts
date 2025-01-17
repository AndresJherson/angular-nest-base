import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { BienCategoria } from '@app/models';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { AppService } from '../../../app.service';

@Injectable()
export class BienCategoriaService {

    query = `
        select json_object(
            'id', bien_categoria.id,
            'nombre', bien_categoria.nombre
        ) as bienCategoria
        from bien_categoria
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            bienCategoria: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new BienCategoria( s.json.bienCategoria ) ),
                createItem: s => this.createItem( s, new BienCategoria( s.json.bienCategoria ) ),
                updateItem: s => this.updateItem( s, new BienCategoria( s.json.bienCategoria ) ),
                deleteItem: s => this.deleteItem( s, new BienCategoria( s.json.bienCategoria ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'bien_categoria' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: BienCategoria,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, bienCategoria: BienCategoria )
    {
        const data = await this.conectorService.executeQuery({
            target: BienCategoria,
            transaction: s.transaction,
            query: `
                ${this.query}
                where bien_categoria.id = :id
            `,
            parameters: {
                id: bienCategoria.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, bienCategoria: BienCategoria )
    {
        bienCategoria.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'bien_categoria' )
            .values([
                {
                    id: bienCategoria.id ?? null,
                    nombre: bienCategoria.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, bienCategoria )
    }


    async updateItem( s: SessionData, bienCategoria: BienCategoria )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'bien_categoria' )
            .set({
                nombre: bienCategoria.nombre ?? null,
            })
            .where({
                id: bienCategoria.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, bienCategoria )
    }


    async deleteItem( s: SessionData, bienCategoria: BienCategoria )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'bien_categoria' )
            .where({
                id: bienCategoria.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
