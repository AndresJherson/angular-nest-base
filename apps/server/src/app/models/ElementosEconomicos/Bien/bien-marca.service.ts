import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { BienMarca } from '@app/models';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { AppService } from '../../../app.service';

@Injectable()
export class BienMarcaService {

    query = `
        select json_object(
            'id', bien_marca.id,
            'nombre', bien_marca.nombre
        ) as bienMarca
        from bien_marca
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            bienMarca: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new BienMarca( s.json.bienMarca ) ),
                createItem: s => this.createItem( s, new BienMarca( s.json.bienMarca ) ),
                updateItem: s => this.updateItem( s, new BienMarca( s.json.bienMarca ) ),
                deleteItem: s => this.deleteItem( s, new BienMarca( s.json.bienMarca ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'bien_marca' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: BienMarca,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, bienMarca: BienMarca )
    {
        const data = await this.conectorService.executeQuery({
            target: BienMarca,
            transaction: s.transaction,
            query: `
                ${this.query}
                where bien_marca.id = :id
            `,
            parameters: {
                id: bienMarca.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, bienMarca: BienMarca )
    {
        bienMarca.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'bien_marca' )
            .values([
                {
                    id: bienMarca.id ?? null,
                    nombre: bienMarca.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, bienMarca )
    }


    async updateItem( s: SessionData, bienMarca: BienMarca )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'bien_marca' )
            .set({
                nombre: bienMarca.nombre ?? null,
            })
            .where({
                id: bienMarca.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, bienMarca )
    }


    async deleteItem( s: SessionData, bienMarca: BienMarca )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'bien_marca' )
            .where({
                id: bienMarca.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
