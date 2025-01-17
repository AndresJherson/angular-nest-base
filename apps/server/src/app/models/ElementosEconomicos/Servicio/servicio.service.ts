import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { Servicio } from '@app/models';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { v4 } from 'uuid';
import { AppService } from '../../../app.service';
import { SQLBuilder } from '../../../services/SQLBuilder';


@Injectable()
export class ServicioService {

    query = `
        select json_object(
            'id', servicio.id,
            'uuid', elemento_economico.uuid,
            'codigo', elemento_economico.codigo,
            'nombre', servicio.nombre,
            'magnitudNombre', 'uni',
            'servicioCategoria', (
                select json_object(
                    'id', servicio_categoria.id,
                    'nombre', servicio_categoria.nombre
                )
                from servicio_categoria
                where servicio_categoria.id = servicio.servicio_categoria_id
            ),
            'precioUnitario', servicio.precio_uni,
            'esSalida', servicio.es_salida
        ) as servicio 
        from servicio
        left join elemento_economico on elemento_economico.id = servicio.id
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            servicio: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Servicio( s.json.servicio ) ),
                createItem: s => this.createItem( s, new Servicio( s.json.servicio ) ),
                updateItem: s => this.updateItem( s, new Servicio( s.json.servicio ) ),
                deleteItem: s => this.deleteItem( s, new Servicio( s.json.servicio ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'elemento_economico' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Servicio,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, servicio: Servicio )
    {
        const data = await this.conectorService.executeQuery({
            target: Servicio,
            transaction: s.transaction,
            query: `
                ${this.query}
                where servicio.id = :id
            `,
            parameters: {
                id: servicio.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, servicio: Servicio )
    {
        const id = await this.getId( s );
        const uuid = v4();

        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'elemento_economico' )
            .values([
                {
                    id: id,
                    uuid: uuid,
                    codigo: `SRVC${id}`
                }
            ])
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'servicio' )
            .values([
                {
                    id: id,
                    nombre: servicio.nombre ?? null,
                    servicio_categoria_id: servicio.servicioCategoria?.id ?? null,
                    precio_uni: servicio.precioUnitario ?? 0,
                    es_salida: Number( servicio.esSalida )
                }
            ])
        });


        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, new Servicio({id}) );
    }


    async updateItem( s: SessionData, servicio: Servicio )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'servicio' )
            .set({
                nombre: servicio.nombre ?? null,
                servicio_categoria_id: servicio.servicioCategoria?.id ?? null,
                precio_uni: servicio.precioUnitario ?? 0,
                es_salida: Number( servicio.esSalida )
            })
            .where({
                id: servicio.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, servicio );
    }


    async deleteItem( s: SessionData, servicio: Servicio )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'servicio' )
            .where({
                id: servicio.id ?? null,
            })
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'elemento_economico' )
            .where({
                id: servicio.id ?? null,
            })
        });

        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0 
        ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}