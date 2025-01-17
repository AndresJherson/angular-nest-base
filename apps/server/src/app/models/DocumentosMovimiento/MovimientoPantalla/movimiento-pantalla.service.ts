import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppService } from '../../../app.service';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { v4 } from 'uuid';
import { EntradaPantalla, MovimientoPantalla, Prop, SalidaPantalla } from '@app/models';

@Injectable()
export class MovimientoPantallaService {

    query = `
        with movimiento_pantalla as (

            select
                documento_movimiento.id as id,
                documento_movimiento.uuid as uuid,
                documento_movimiento.codigo as codigo,
                documento_movimiento.f_emision as fechaEmision,
                documento_movimiento.f_anulacion as fechaAnulacion,
                documento_movimiento.usuario_id as usuarioId,
                documento_movimiento.concepto as concepto,
                documento_movimiento.documento_transaccion_id as documentoTransaccionId,
                'EntradaPantalla' as type
            from entrada_pantalla
            left join documento_movimiento on documento_movimiento.id = entrada_pantalla.id

            union all

            select
                documento_movimiento.id as id,
                documento_movimiento.uuid as uuid,
                documento_movimiento.codigo as codigo,
                documento_movimiento.f_emision as fechaEmision,
                documento_movimiento.f_anulacion as fechaAnulacion,
                documento_movimiento.usuario_id as usuarioId,
                documento_movimiento.concepto as concepto,
                documento_movimiento.documento_transaccion_id as documentoTransaccionId,
                'SalidaPantalla' as type
            from salida_pantalla
            left join documento_movimiento on documento_movimiento.id = salida_pantalla.id

        ),
        movimiento_pantalla_detalle as (

            select
                entrada_pantalla_detalle.id as id,
                entrada_pantalla_detalle.entrada_pantalla_id as movimientoPantallaId,
                entrada_pantalla_detalle.pantalla_modelo_calidad_id as pantallaModeloCalidadId,
                entrada_pantalla_detalle.cant as cantidad,
                entrada_pantalla_detalle.costo_uni as importeUnitario,
                'EntradaPantallaDetalle' as type
            from entrada_pantalla_detalle

            union all

            select
                salida_pantalla_detalle.id as id,
                salida_pantalla_detalle.salida_pantalla_id as movimientoPantallaId,
                salida_pantalla_detalle.pantalla_modelo_calidad_id as pantallaModeloCalidadId,
                salida_pantalla_detalle.cant as cantidad,
                salida_pantalla_detalle.precio_uni as importeUnitario,
                'SalidaPantallaDetalle' as type
            from salida_pantalla_detalle

        )
        select json_object(
            'id', movimiento_pantalla.id,
            'uuid', movimiento_pantalla.uuid,
            'codigo', movimiento_pantalla.codigo,
            'fechaEmision', movimiento_pantalla.fechaEmision,
            'fechaAnulacion', movimiento_pantalla.fechaAnulacion,
            'usuario', (
                select json_object(
                    'id', usuario.id,
                    'nombre', usuario.nombre,
                    'usuario', usuario.usuario,
                    'contrasena', usuario.contrasena,
                    'esActivo', usuario.es_activo
                ) as usuario
                from usuario
                where usuario.id = movimiento_pantalla.usuarioId
            ),
            'concepto', movimiento_pantalla.concepto,
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
                    where documento_transaccion.id = movimiento_pantalla.documentoTransaccionId
            ),
            'detalles', (
                select json_arrayagg( json_object(
                    'id', movimiento_pantalla_detalle.id,
                    'pantallaModeloCalidad', (
                        select json_object(
                            'id', pantalla_modelo_calidad.id,
                            'uuid', elemento_economico.uuid,
                            'codigo', elemento_economico.codigo,
                            'pantallaModelo', (
                                select json_object(
                                    'id', pantalla_modelo.id,
                                    'pantallaMarca', (
                                        select json_object(
                                            'id', pantalla_marca.id,
                                            'nombre', pantalla_marca.nombre
                                        ) as pantallaMarca
                                        from pantalla_marca
                                        where pantalla_marca.id = pantalla_modelo.pantalla_marca_id
                                    ),
                                    'nombre', pantalla_modelo.nombre
                                ) as pantallaModelo
                                from pantalla_modelo
                                where pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
                            ),
                            'calidad', (
                                select json_object(
                                    'id', calidad.id,
                                    'nombre', calidad.nombre
                                ) as calidad
                                from calidad
                                where calidad.id = pantalla_modelo_calidad.calidad_id
                            ),
                            'precioUnitario', pantalla_modelo_calidad.precio_uni
                        ) as pantallaModeloCalidad
                        from pantalla_modelo_calidad
                        left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id
                        where pantalla_modelo_calidad.id = movimiento_pantalla_detalle.pantallaModeloCalidadId
                    ),
                    'cantidad', movimiento_pantalla_detalle.cantidad,
                    'importeUnitario', movimiento_pantalla_detalle.importeUnitario,
                    'type', movimiento_pantalla_detalle.type
                ) )
                from movimiento_pantalla_detalle
                where movimiento_pantalla_detalle.movimientoPantallaId = movimiento_pantalla.id
            ),
            'type', movimiento_pantalla.type
        ) as data
        from movimiento_pantalla
    `;


    constructor(
        private appService: AppService,
        private conectorService: ConectorService
    )
    {
        this.appService.register({
            movimientoPantalla: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( 
                    s, 
                    MovimientoPantalla.initialize([ Prop.setObject( s.json.movimientoPantalla ) ])[0]
                ),
                createItem: s => this.createItem( 
                    s, 
                    MovimientoPantalla.initialize([ Prop.setObject( s.json.movimientoPantalla ) ])[0]
                ),
                updateItemCancel: s => this.updateItemCancel( 
                    s, 
                    MovimientoPantalla.initialize([ Prop.setObject( s.json.movimientoPantalla ) ])[0]
                ),
                deleteItem: s => this.deleteItem( 
                    s,
                    MovimientoPantalla.initialize([ Prop.setObject( s.json.movimientoPantalla ) ])[0]
                )
            }
        })
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'documento_movimiento' );
    }


    async executeCreateCollection( s: SessionData, movimientosPantalla: MovimientoPantalla[] )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'documento_movimiento' )
            .values( movimientosPantalla.map( movPantalla => ({
                id: movPantalla.id ?? null,
                uuid: movPantalla.uuid ?? null,
                codigo: movPantalla.codigo ?? null,
                f_emision: movPantalla.fechaEmision ?? movPantalla.documentoTransaccion?.fechaEmision ?? null,
                f_anulacion: movPantalla.fechaAnulacion ?? movPantalla.documentoTransaccion?.fechaAnulacion ?? null,
                usuario_id: s.usuario.id ?? null,
                concepto: movPantalla.concepto ?? null,
                documento_transaccion_id: movPantalla.documentoTransaccion?.id ?? null
            }) ) )
        });

        const entradasPantalla = movimientosPantalla.filter( item => item instanceof EntradaPantalla );
        const salidasPantalla = movimientosPantalla.filter( item => item instanceof SalidaPantalla );


        let affectedRows2 = 0;
        let affectedRows3 = 0;
        if ( entradasPantalla.length > 0 ) {

            affectedRows2 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'entrada_pantalla' )
                .values( entradasPantalla.map( entradaPantalla => ({
                    id: entradaPantalla.id ?? null,
                }) ) )
            });

            affectedRows3 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'entrada_pantalla_detalle' )
                .values( 
                    entradasPantalla
                    .flatMap( entradaPantalla => entradaPantalla.detalles )
                    .map( detalle => ({
                        id: detalle.id ?? null,
                        entrada_pantalla_id: detalle.documentoMovimiento?.id ?? null,
                        pantalla_modelo_calidad_id: detalle.pantallaModeloCalidad?.id ?? null,
                        cant: detalle.cantidad ?? 0,
                        costo_uni: detalle.importeUnitario ?? 0
                    }) ) 
                )
            });

        }


        let affectedRows4 = 0;
        let affectedRows5 = 0;
        if ( salidasPantalla.length > 0 ) {

            affectedRows4 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'salida_pantalla' )
                .values( salidasPantalla.map( salidaPantalla => ({
                    id: salidaPantalla.id ?? null,
                }) ) )
            });

            affectedRows5 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'salida_pantalla_detalle' )
                .values( 
                    salidasPantalla
                    .flatMap( salidaPantalla => salidaPantalla.detalles )
                    .map( detalle => ({
                        id: detalle.id ?? null,
                        salida_pantalla_id: detalle.documentoMovimiento?.id ?? null,
                        pantalla_modelo_calidad_id: detalle.pantallaModeloCalidad?.id ?? null,
                        cant: detalle.cantidad ?? 0,
                        precio_uni: detalle.importeUnitario ?? 0
                    }) ) 
                )
            });

        }

        if (
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0 &&
            affectedRows4 === 0 &&
            affectedRows5 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );

    }


    async executeDeleteCollection( s: SessionData, movimientosPantalla: MovimientoPantalla[] )
    {
        const ids = movimientosPantalla.map( mov => Prop.setNumberStrict( mov.id ) )
                                        .filter( id => id !== undefined );

        const entradasPantalla = movimientosPantalla.filter( item => item instanceof EntradaPantalla );
        const salidasPantalla = movimientosPantalla.filter( item => item instanceof SalidaPantalla );


        let affectedRows1 = 0
        let affectedRows2 = 0
        if ( entradasPantalla.length > 0 ) {

            affectedRows1 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'entrada_pantalla_detalle' )
                .where({
                    entrada_pantalla_id: ids
                })
            });

            affectedRows2 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'entrada_pantalla' )
                .where({
                    id: ids
                })
            });

        }


        let affectedRows3 = 0
        let affectedRows4 = 0
        if ( salidasPantalla.length > 0 ) {

            affectedRows3 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'salida_pantalla_detalle' )
                .where({
                    salida_pantalla_id: ids
                })
            });

            affectedRows4 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'salida_pantalla' )
                .where({
                    id: ids
                })
            });

        }


        const affectedRows5 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'documento_movimiento' )
            .where({
                id: ids
            })
        });


        if (
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0 &&
            affectedRows4 === 0 &&
            affectedRows5 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );

    }


    async getCollection( s: SessionData )
    {
        const data = await this.conectorService.executeQuery({
            target: MovimientoPantalla.initialize,
            transaction: s.transaction,
            query: this.query,
        });

        data.forEach( mov => mov.procesarInformacionMovimiento() );

        return data;
    }


    async getItem( s: SessionData, movimientoPantalla: MovimientoPantalla )
    {
        const data = await this.conectorService.executeQuery({
            target: MovimientoPantalla.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                where movimiento_pantalla.id = :id
            `,
            parameters: {
                id: movimientoPantalla.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0].procesarInformacionMovimiento();
    }


    async createCollection( s: SessionData, movimientosPantalla: MovimientoPantalla[] )
    {
        const entradasPantalla = movimientosPantalla.filter( item => item instanceof EntradaPantalla );
        const salidasPantalla = movimientosPantalla.filter( item => item instanceof SalidaPantalla );
        

        const keysEntradaPantalla: Parameters<MovimientoPantalla['setRelation']>[0] = {
            id: await this.getId( s ),
            detalleId: await this.conectorService.getId( s.transaction, 'entrada_pantalla_detalle' )
        };

        entradasPantalla.forEach( entradaPantalla => {

            entradaPantalla
            .set({
                uuid: v4(),
                codigo: `MOV-${entradaPantalla.id}`
            })
            .setRelation( keysEntradaPantalla )
            .procesarInformacionMovimiento();

        } )
        

        const keysSalidaPantalla: Parameters<MovimientoPantalla['setRelation']>[0] = {
            id: keysEntradaPantalla.id,
            detalleId: await this.conectorService.getId( s.transaction, 'salida_pantalla_detalle' )
        };

        salidasPantalla.forEach( salidaPantalla => {
            
            salidaPantalla
            .set({
                uuid: v4(),
                codigo: `MOV-${salidaPantalla.id}`
            })
            .setRelation( keysSalidaPantalla )
            .procesarInformacionMovimiento();
            
        } )

        await this.executeCreateCollection( s, [ ...entradasPantalla, ...salidasPantalla ] );

        return this.getCollection( s );
    }


    async createItem( s: SessionData, movimientoPantalla: MovimientoPantalla )
    {
        const id = await this.getId( s );

        movimientoPantalla
        .set({
            id: id,
            uuid: v4(),
            codigo: `MOV-${id}`,
        })
        .setRelation({
            id: await this.getId( s ),
            detalleId: await this.conectorService.getId(
                s.transaction,
                movimientoPantalla instanceof EntradaPantalla
                    ? 'entrada_pantalla_detalle'
                    : 'salida_pantalla_detalle'
            )
        })
        .procesarInformacionMovimiento();

        await this.executeCreateCollection( s, [ movimientoPantalla ] );

        return await this.getItem( s, movimientoPantalla );
    }


    async updateItemCancel( s: SessionData, movimientoPantalla: MovimientoPantalla )
    {
        const movPantalla2validate = await this.getItem( s, movimientoPantalla );
        if ( movPantalla2validate.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );

        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'documento_movimiento' )
            .set({
                f_anulacion: movimientoPantalla.fechaAnulacion ?? null
            })
            .where({
                id: movimientoPantalla.id ?? null
            })
        });


        if ( affectedRows1 === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, movimientoPantalla );
    }


    async deleteItem( s: SessionData, movimientoPantalla: MovimientoPantalla )
    {
        const movimientoPantalla2delete = await this.getItem( s, movimientoPantalla );
        await this.executeDeleteCollection( s, [ movimientoPantalla2delete ] );
    }
}