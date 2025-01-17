import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { ServicioCategoria } from '@app/models';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { AppService } from '../../../app.service';

@Injectable()
export class ServicioCategoriaService {

    query = `
        select json_object(
            'id', servicio_categoria.id,
            'nombre', servicio_categoria.nombre
        ) as servicioCategoria
        from servicio_categoria
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            servicioCategoria: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new ServicioCategoria( s.json.servicioCategoria ) ),
                createItem: s => this.createItem( s, new ServicioCategoria( s.json.servicioCategoria ) ),
                updateItem: s => this.updateItem( s, new ServicioCategoria( s.json.servicioCategoria ) ),
                deleteItem: s => this.deleteItem( s, new ServicioCategoria( s.json.servicioCategoria ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'servicio_categoria' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: ServicioCategoria,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, servicioCategoria: ServicioCategoria )
    {
        const data = await this.conectorService.executeQuery({
            target: ServicioCategoria,
            transaction: s.transaction,
            query: `
                ${this.query}
                where servicio_categoria.id = :id
            `,
            parameters: {
                id: servicioCategoria.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, servicioCategoria: ServicioCategoria )
    {
        servicioCategoria.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'servicio_categoria' )
            .values([
                {
                    id: servicioCategoria.id ?? null,
                    nombre: servicioCategoria.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, servicioCategoria )
    }


    async updateItem( s: SessionData, servicioCategoria: ServicioCategoria )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'servicio_categoria' )
            .set({
                nombre: servicioCategoria.nombre ?? null,
            })
            .where({
                id: servicioCategoria.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, servicioCategoria )
    }


    async deleteItem( s: SessionData, servicioCategoria: ServicioCategoria )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'servicio_categoria' )
            .where({
                id: servicioCategoria.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}