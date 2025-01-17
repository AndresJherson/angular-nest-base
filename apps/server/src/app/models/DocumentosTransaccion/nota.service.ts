import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SessionData } from '../../interfaces/interfaces';
import { ConectorService } from '../../services/conector.service';
import { Nota } from '@app/models';
import { ERROR_CRUD } from '../../interfaces/constants';
import { SQLBuilder } from '../../services/SQLBuilder';
import { AppService } from '../../app.service';

@Injectable()
export class NotaService {


    query = `
        select json_object(
            'id', nota.id,
            'documentoTransaccion', null,
            'fechaCreacion', nota.f_creacion,
            'descripcion', nota.descripcion,
            'usuario', (
                select json_object(
                    'id', usuario.id,
                    'nombre', usuario.nombre,
                    'usuario', usuario.usuario,
                    'contrasena', usuario.contrasena,
                    'esActivo', usuario.es_activo
                ) as usuario
                from usuario
                where usuario.id = nota.usuario_id
            )
        ) as data
        from nota
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            nota: {
                createItem: s => this.createItem( s, new Nota( s.json.nota ) ),
                deleteItem: s => this.deleteItem( s, new Nota( s.json.nota ) )
            }
        });
    }


    async executeCreateCollection( s: SessionData, notas: Nota[] )
    {
        return await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'nota' )
            .values( notas.map( nota => (
                {
                    id: nota.id ?? null,
                    documento_transaccion_id: nota.documentoTransaccion?.id ?? null,
                    f_creacion: nota.fechaCreacion ?? null,
                    descripcion: nota.descripcion ?? null,
                    usuario_id: s.usuario.id ?? null,
                }
            ) ) )
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'nota' );
    }


    async getItem( s: SessionData, nota: Nota )
    {
        const data = await this.conectorService.executeQuery({
            target: Nota,
            transaction: s.transaction,
            query: `
                ${this.query}
                where nota.id = :id
            `,
            parameters: {
                id: nota.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createItem( s: SessionData, nota: Nota )
    {
        nota.set({
            id: await this.getId( s )
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'nota' )
            .values([
                {
                    id: nota.id ?? null,
                    documento_transaccion_id: nota.documentoTransaccion?.id ?? null,
                    f_creacion: nota.fechaCreacion ?? null,
                    descripcion: nota.descripcion ?? null,
                    usuario_id: s.usuario.id ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

        return await this.getItem( s, nota );
    }


    async deleteItem( s: SessionData, nota: Nota )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'nota' )
            .where({
                id: nota.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}