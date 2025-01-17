import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AppService } from "../../../app.service";
import { ConectorService } from "../../../services/conector.service";
import { SessionData } from "../../../interfaces/interfaces";
import { v4 } from "uuid";
import { ERROR_CRUD } from "../../../interfaces/constants";
import { EntradaEfectivo, MovimientoEfectivo, Prop, SalidaEfectivo } from '@app/models';
import { SQLBuilder } from "../../../services/SQLBuilder";

@Injectable()
export class MovimientoEfectivoService {

    query = `
        with movimiento_efectivo as (
            select
                entrada_efectivo.id as id,
                entrada_efectivo.efectivo as efectivo,
                entrada_efectivo.medio_transferencia_id as medioTransferenciaId,
                'EntradaEfectivo' as type
            from entrada_efectivo

            union all

            select
                salida_efectivo.id as id,
                salida_efectivo.efectivo as efectivo,
                salida_efectivo.medio_transferencia_id as medioTransferenciaId,
                'SalidaEfectivo' as type
            from salida_efectivo
        )
        select json_object(
            'id', documento_movimiento.id,
            'uuid', documento_movimiento.uuid,
            'codigo', documento_movimiento.codigo,
            'fechaEmision', documento_movimiento.f_emision,
            'fechaAnulacion', documento_movimiento.f_anulacion,
            'usuario', (
                select json_object(
                    'id', usuario.id,
                    'nombre', usuario.nombre,
                    'usuario', usuario.usuario,
                    'contrasena', usuario.contrasena,
                    'esActivo', usuario.es_activo
                ) as usuario
                from usuario
                where usuario.id = documento_movimiento.usuario_id
            ),
            'concepto', documento_movimiento.concepto,
            'importeNeto', movimiento_efectivo.efectivo,
            'medioTransferencia',(
                select json_object(
                    'id', medio_transferencia.id,
                    'nombre', medio_transferencia.nombre
                )
                from medio_transferencia
                where medio_transferencia.id = movimiento_efectivo.medioTransferenciaId
            ),
            'documentoTransaccion', (
                select json_object(
                    'id', documento_transaccion.id,
                    'uuid', documento_transaccion.uuid,
                    'codigoSerie', documento_transaccion.cod_serie,
                    'codigoNumero', documento_transaccion.cod_numero,
                    'fechaCreacion', documento_transaccion.f_creacion,
                    'fechaEmision', documento_transaccion.f_emision,
                    'fechaAnulacion', documento_transaccion.f_anulacion,
                    'fechaActualizacion', documento_transaccion.f_actualizacion,
                    'usuario', (
                        select json_object(
                            'id', usuario.id,
                            'nombre', usuario.nombre,
                            'usuario', usuario.usuario,
                            'contrasena', usuario.contrasena,
                            'esActivo', usuario.es_activo
                        ) as usuario
                        from usuario
                        where usuario.id = documento_transaccion.usuario_id
                    ),
                    'establecimiento', (
                        select json_object(
                            'id', establecimiento.id,
                            'ruc', establecimiento.ruc,
                            'razonSocial', establecimiento.razon_social,
                            'rubro', establecimiento.rubro,
                            'domicilio', establecimiento.domicilio,
                            'celular', establecimiento.celular
                        )
                        from establecimiento
                        where establecimiento.id = documento_transaccion.establecimiento_id
                    ),
                    'concepto', documento_transaccion.concepto,
                    'carpeta', null
                )
                from documento_transaccion
                where documento_transaccion.id = documento_movimiento.documento_transaccion_id
            ),
            'type', movimiento_efectivo.type
        ) as data
        from movimiento_efectivo
        left join documento_movimiento on documento_movimiento.id = movimiento_efectivo.id
        left join medio_transferencia on medio_transferencia.id = movimiento_efectivo.medioTransferenciaId
    `;


    constructor(
        private appService: AppService,
        private conectorService: ConectorService
    )
    {
        this.appService.register({
            movimientoEfectivo: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( 
                    s, 
                    MovimientoEfectivo.initialize([ Prop.setObject( s.json.movimientoEfectivo ) ])[0]
                ),
                createItem: s => this.createItem( 
                    s, 
                    MovimientoEfectivo.initialize([ Prop.setObject( s.json.movimientoEfectivo ) ])[0]
                ),
                updateItemCancel: s => this.updateItemCancel( 
                    s, 
                    MovimientoEfectivo.initialize([ Prop.setObject( s.json.movimientoEfectivo ) ])[0]
                ),
                // prueba
                deleteItem: s => this.deleteItem(
                    s,
                    MovimientoEfectivo.initialize([ Prop.setObject( s.json.movimientoEfectivo ) ])[0]
                )
            }
        })
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'documento_movimiento' );
    }


    async executeCreateCollection( s: SessionData, movimientosEfectivo: MovimientoEfectivo[] )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'documento_movimiento' )
            .values( movimientosEfectivo.map( movEfectivo => ({
                id: movEfectivo.id ?? null,
                uuid: movEfectivo.uuid ?? null,
                codigo: movEfectivo.codigo ?? null,
                f_emision: movEfectivo.fechaEmision ?? movEfectivo.documentoTransaccion?.fechaEmision ?? null,
                f_anulacion: movEfectivo.fechaAnulacion ?? movEfectivo.documentoTransaccion?.fechaAnulacion ?? null,
                usuario_id: s.usuario.id ?? null,
                concepto: movEfectivo.concepto ?? null,
                documento_transaccion_id: movEfectivo.documentoTransaccion?.id ?? null
            }) ) )
        });

        const entradasEfectivo = movimientosEfectivo.filter( item => item instanceof EntradaEfectivo );
        const salidasEfectivo = movimientosEfectivo.filter( item => item instanceof SalidaEfectivo );


        let affectedRows2 = 0
        if ( entradasEfectivo.length > 0 ) {

            affectedRows2 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'entrada_efectivo' )
                .values( entradasEfectivo.map( entradaEfectivo => ({
                    id: entradaEfectivo.id ?? null,
                    efectivo: entradaEfectivo.importeNeto ?? 0,
                    medio_transferencia_id: entradaEfectivo.medioTransferencia?.id ?? null
                }) ) )
            });

        }


        let affectedRows3 = 0
        if ( salidasEfectivo.length > 0 ) {

            affectedRows3 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'salida_efectivo' )
                .values( salidasEfectivo.map( salidaEfectivo => ({
                    id: salidaEfectivo.id ?? null,
                    efectivo: salidaEfectivo.importeNeto ?? 0,
                    medio_transferencia_id: salidaEfectivo.medioTransferencia?.id ?? null
                }) ) )
            });

        }

        if (
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

    }


    async executeDeleteCollection( s: SessionData, movimientosEfectivo: MovimientoEfectivo[] )
    {
        const ids = movimientosEfectivo.map( mov => Prop.setNumberStrict( mov.id ) )
                                        .filter( id => id !== undefined );

        const entradasEfectivo = movimientosEfectivo.filter( item => item instanceof EntradaEfectivo );
        const salidasEfectivo = movimientosEfectivo.filter( item => item instanceof SalidaEfectivo );


        let affectedRows1 = 0
        if ( entradasEfectivo.length > 0 ) {

            affectedRows1 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'entrada_efectivo' )
                .where({
                    id: ids
                })
            });

        }


        let affectedRows2 = 0
        if ( salidasEfectivo.length > 0 ) {

            affectedRows2 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'salida_efectivo' )
                .where({
                    id: ids
                })
            });

        }

        const affectedRows3 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'documento_movimiento' )
            .where({
                id: ids
            })
        });


        if (
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: MovimientoEfectivo.initialize,
            transaction: s.transaction,
            query: this.query,
        });
    }


    async getItem( s: SessionData, movimientoEfectivo: MovimientoEfectivo )
    {
        const data = await this.conectorService.executeQuery({
            target: MovimientoEfectivo.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                where documento_movimiento.id = :id
            `,
            parameters: {
                id: movimientoEfectivo.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0];
    }


    async createCollection( s: SessionData, movimientosEfectivo: MovimientoEfectivo[] )
    {
        const entradasEfectivo = movimientosEfectivo.filter( item => item instanceof EntradaEfectivo );
        const salidasEfectivo = movimientosEfectivo.filter( item => item instanceof SalidaEfectivo );
        
        
        let id = await this.getId( s );
        
        movimientosEfectivo.forEach( movEfectivo => {
            
            movEfectivo.set({
                id: id,
                uuid: v4(),
                codigo: `MOV-${id}`
            })
            .procesarInformacionMovimiento();

            id++;

        } );

        await this.executeCreateCollection( s, movimientosEfectivo );

        return this.getCollection( s );
    }


    async createItem( s: SessionData, movimientoEfectivo: MovimientoEfectivo )
    {
        const id = await this.getId( s );

        movimientoEfectivo.set({
            id: id,
            uuid: v4(),
            codigo: `MOV-${id}`,
        })
        .procesarInformacionMovimiento();

        await this.executeCreateCollection( s, [ movimientoEfectivo ] );

        return await this.getItem( s, movimientoEfectivo );
    }


    async updateItemCancel( s: SessionData, movimientoEfectivo: MovimientoEfectivo )
    {
        const movEfectivo2validate = await this.getItem( s, movimientoEfectivo );
        if ( movEfectivo2validate.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );

        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'documento_movimiento' )
            .set({
                f_anulacion: movimientoEfectivo.fechaAnulacion ?? null
            })
            .where({
                id: movimientoEfectivo.id ?? null
            })
        });


        if ( affectedRows1 === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, movimientoEfectivo );
    }


    async deleteItem( s: SessionData, movimientoEfectivo: MovimientoEfectivo )
    {
        const movimientoEfectivo2delete = await this.getItem( s, movimientoEfectivo );
        await this.executeDeleteCollection( s, [ movimientoEfectivo2delete ] );
    }
}