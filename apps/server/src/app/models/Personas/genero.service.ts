import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../services/conector.service';
import { SessionData } from '../../interfaces/interfaces';
import { Genero } from '@app/models';
import { ERROR_CRUD } from '../../interfaces/constants';
import { AppService } from '../../app.service';
import { SQLBuilder } from '../../services/SQLBuilder';

@Injectable()
export class GeneroService {

    query = `
        select json_object(
            'id', genero.id,
            'nombre', genero.nombre
        ) as genero
        from genero
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            genero: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Genero( s.json.genero ) ),
                createItem: s => this.createItem( s, new Genero( s.json.genero ) ),
                updateItem: s => this.updateItem( s, new Genero( s.json.genero ) ),
                deleteItem: s => this.deleteItem( s, new Genero( s.json.genero ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'genero' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Genero,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, genero: Genero )
    {
        const data = await this.conectorService.executeQuery({
            target: Genero,
            transaction: s.transaction,
            query: `
                ${this.query}
                where genero.id = :id
            `,
            parameters: {
                id: genero.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, genero: Genero )
    {
        const id = await this.getId( s );

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'genero' )
            .values([
                {
                    id: id,
                    nombre: genero.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, new Genero({id}) );
    }


    async updateItem( s: SessionData, genero: Genero )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'genero' )
            .set({
                nombre: genero.nombre ?? null,
            })
            .where({
                id: genero.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, genero );
    }


    async deleteItem( s: SessionData, genero: Genero )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'genero' )
            .where({
                id: genero.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
