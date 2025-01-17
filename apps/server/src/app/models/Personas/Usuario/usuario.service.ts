import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { Usuario } from '@app/models';
import { AppService } from '../../../app.service';
import { SQLBuilder } from '../../../services/SQLBuilder';

@Injectable()
export class UsuarioService {

    query = `
        select json_object(
            'id', usuario.id,
            'nombre', usuario.nombre,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'esActivo', usuario.es_activo
        ) as usuario
        from usuario
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            usuario: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Usuario( s.json.usuario ) ),
                createItem: s => this.createItem( s, new Usuario( s.json.usuario ) ),
                updateItem: s => this.updateItem( s, new Usuario( s.json.usuario ) ),
                deleteItem: s => this.deleteItem( s, new Usuario( s.json.usuario ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'usuario' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Usuario,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, usuario: Usuario )
    {
        const data = await this.conectorService.executeQuery({
            target: Usuario,
            transaction: s.transaction,
            query: `
                ${this.query}
                where usuario.id = :id
            `,
            parameters: {
                id: usuario.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, usuario: Usuario )
    {
        const id = await this.getId( s );

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'usuario' )
            .values([
                {
                    id: id,
                    nombre: usuario.nombre ?? null,
                    usuario: usuario.usuario ?? null,
                    contrasena: usuario.contrasena ?? null,
                    es_activo: usuario.esActivo ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, new Usuario({id}) );
    }


    async updateItem( s: SessionData, usuario: Usuario )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'usuario' )
            .set({
                nombre: usuario.nombre ?? null,
                usuario: usuario.usuario ?? null,
                contrasena: usuario.contrasena ?? null,
                es_activo: usuario.esActivo ?? null,
            })
            .where({
                id: usuario.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, usuario );
    }


    async deleteItem( s: SessionData, usuario: Usuario )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'usuario' )
            .where({
                id: usuario.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
