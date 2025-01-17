import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { Cliente } from '@app/models';
import { AppService } from '../../../app.service';
import { SQLBuilder } from '../../../services/SQLBuilder';

@Injectable()
export class ClienteService {

    query = `
        select json_object(
            'id', cliente.id,
            'documentoIdentificacion',(
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = cliente.documento_identificacion_id
            ),
            'codigo', cliente.codigo,
            'nombre', cliente.nombre,
            'apellido', cliente.apellido,
            'genero', (
                select json_object(
                    'id', genero.id,
                    'nombre', genero.nombre
                ) as genero
                from genero
                where genero.id = cliente.genero_id
            ),
            'celular', cliente.celular,
            'celularRespaldo', cliente.celular_respaldo
        ) as cliente
        from cliente
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            cliente: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Cliente( s.json.cliente ) ),
                createItem: s => this.createItem( s, new Cliente( s.json.cliente ) ),
                updateItem: s => this.updateItem( s, new Cliente( s.json.cliente ) ),
                deleteItem: s => this.deleteItem( s, new Cliente( s.json.cliente ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'cliente' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Cliente,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, cliente: Cliente )
    {
        const data = await this.conectorService.executeQuery({
            target: Cliente,
            transaction: s.transaction,
            query: `
                ${this.query}
                where cliente.id = :id
            `,
            parameters: {
                id: cliente.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, cliente: Cliente )
    {
        const id = await this.getId( s );

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'cliente' )
            .values([
                {
                    id: id,
                    documento_identificacion_id: cliente.documentoIdentificacion?.id ?? null,
                    codigo: cliente.codigo ?? null,
                    nombre: cliente.nombre ?? null,
                    apellido: cliente.apellido ?? null,
                    genero_id: cliente.genero?.id ?? null,
                    celular: cliente.celular ?? null,
                    celular_respaldo: cliente.celularRespaldo ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, new Cliente({id}) );
    }


    async updateItem( s: SessionData, cliente: Cliente )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'cliente' )
            .set({
                documento_identificacion_id: cliente.documentoIdentificacion?.id ?? null,
                codigo: cliente.codigo ?? null,
                nombre: cliente.nombre ?? null,
                apellido: cliente.apellido ?? null,
                genero_id: cliente.genero?.id ?? null,
                celular: cliente.celular ?? null,
                celular_respaldo: cliente.celularRespaldo ?? null,
            })
            .where({
                id: cliente.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, cliente );
    }


    async deleteItem( s: SessionData, cliente: Cliente )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'cliente' )
            .where({
                id: cliente.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
