import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { Empleado } from '@app/models';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { AppService } from '../../../app.service';
import { SQLBuilder } from '../../../services/SQLBuilder';

@Injectable()
export class EmpleadoService {

    query = `
        select json_object(
            'id', empleado.id,
            'documentoIdentificacion', (
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                )
                from documento_identificacion
                where documento_identificacion.id = empleado.documento_identificacion_id
            ),
            'codigo', empleado.cod,
            'nombre', empleado.nombre,
            'apellido', empleado.apellido,
            'domicilio', empleado.domicilio,
            'genero', (
                select json_object(
                    'id', genero.id,
                    'nombre', genero.nombre
                )
                from genero
                where genero.id = empleado.genero_id
            ),
            'celular', empleado.celular,
            'celularRespaldo', empleado.celular_respaldo,
            'esTecnico', empleado.es_tecnico,
            'usuario', (
                select json_object(
                    'id', usuario.id,
                    'nombre', usuario.nombre,
                    'usuario', usuario.usuario,
                    'contrasena', usuario.contrasena,
                    'esActivo', usuario.es_activo
                )
                from usuario
                where usuario.id = empleado.usuario_id
            )
        )
        from empleado
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            empleado: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Empleado( s.json.empleado ) ),
                createItem: s => this.createItem( s, new Empleado( s.json.empleado ) ),
                updateItem: s => this.updateItem( s, new Empleado( s.json.empleado ) ),
                deleteItem: s => this.deleteItem( s, new Empleado( s.json.empleado ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'empleado' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Empleado,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, empleado: Empleado )
    {
        const data = await this.conectorService.executeQuery({
            target: Empleado,
            transaction: s.transaction,
            query: `
                ${this.query}
                where empleado.id = :id
            `,
            parameters: {
                id: empleado.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, empleado: Empleado )
    {
        const id = await this.getId( s );

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'empleado' )
            .values([
                {
                    id: id,
                    documento_identificacion_id: empleado.documentoIdentificacion?.id ?? null,
                    cod: empleado.codigo ?? null,
                    nombre: empleado.nombre ?? null,
                    apellido: empleado.apellido ?? null,
                    domicilio: empleado.domicilio ?? null,
                    genero_id: empleado.genero?.id ?? null,
                    celular: empleado.celular ?? null,
                    celular_respaldo: empleado.celularRespaldo ?? null,
                    es_tecnico: empleado.esTecnico ?? null,
                    usuario_id: empleado.usuario?.id ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, new Empleado({id}) );
    }


    async updateItem( s: SessionData, empleado: Empleado )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'empleado' )
            .set({
                documento_identificacion_id: empleado.documentoIdentificacion?.id ?? null,
                cod: empleado.codigo ?? null,
                nombre: empleado.nombre ?? null,
                apellido: empleado.apellido ?? null,
                domicilio: empleado.domicilio ?? null,
                genero_id: empleado.genero?.id ?? null,
                celular: empleado.celular ?? null,
                celular_respaldo: empleado.celularRespaldo ?? null,
                es_tecnico: empleado.esTecnico ?? null,
                usuario_id: empleado.usuario?.id ?? null,
            })
            .where({
                id: empleado.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, empleado );
    }


    async deleteItem( s: SessionData, empleado: Empleado )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'empleado' )
            .where({
                id: empleado.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
