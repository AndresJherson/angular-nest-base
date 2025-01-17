import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppService } from '../../../app.service';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { v4 } from 'uuid';
import { EntradaProducto, MovimientoProducto, Prop, SalidaProducto } from '@app/models';

@Injectable()
export class MovimientoProductoService {

    query = `
        with movimiento_producto as (

            select
                documento_movimiento.id as id,
                documento_movimiento.uuid as uuid,
                documento_movimiento.codigo as codigo,
                documento_movimiento.f_emision as fechaEmision,
                documento_movimiento.f_anulacion as fechaAnulacion,
                documento_movimiento.usuario_id as usuarioId,
                documento_movimiento.concepto as concepto,
                documento_movimiento.documento_transaccion_id as documentoTransaccionId,
                'EntradaProducto' as type
            from entrada_producto
            left join documento_movimiento on documento_movimiento.id = entrada_producto.id

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
                'SalidaProducto' as type
            from salida_producto
            left join documento_movimiento on documento_movimiento.id = salida_producto.id

        ),
        movimiento_producto_detalle as (

            select
                entrada_producto_detalle.id as id,
                entrada_producto_detalle.entrada_producto_id as movimientoProductoId,
                entrada_producto_detalle.producto_id as productoId,
                entrada_producto_detalle.cant as cantidad,
                entrada_producto_detalle.costo_uni as importeUnitario,
                'EntradaProductoDetalle' as type
            from entrada_producto_detalle

            union all

            select
                salida_producto_detalle.id as id,
                salida_producto_detalle.salida_producto_id as movimientoProductoId,
                salida_producto_detalle.producto_id as productoId,
                salida_producto_detalle.cant as cantidad,
                salida_producto_detalle.precio_uni as importeUnitario,
                'SalidaProductoDetalle' as type
            from salida_producto_detalle

        )
        select json_object(
            'id', movimiento_producto.id,
            'uuid', movimiento_producto.uuid,
            'codigo', movimiento_producto.codigo,
            'fechaEmision', movimiento_producto.fechaEmision,
            'fechaAnulacion', movimiento_producto.fechaAnulacion,
            'usuario', (
                select json_object(
                    'id', usuario.id,
                    'nombre', usuario.nombre,
                    'usuario', usuario.usuario,
                    'contrasena', usuario.contrasena,
                    'esActivo', usuario.es_activo
                ) as usuario
                from usuario
                where usuario.id = movimiento_producto.usuarioId
            ),
            'concepto', movimiento_producto.concepto,
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
                    where documento_transaccion.id = movimiento_producto.documentoTransaccionId
            ),
            'detalles', (
                select json_arrayagg( json_object(
                    'id', movimiento_producto_detalle.id,
                    'producto', (
                        select json_object(
                            'id', producto.id,
                            'uuid', elemento_economico.uuid,
                            'codigo', elemento_economico.codigo,
                            'nombre', bien.nombre,
                            'magnitud', (
                                select json_object(
                                    'id', magnitud.id,
                                    'nombre', magnitud.nombre,
                                    'magnitudTipo', (
                                        select json_object(
                                            'id', magnitud_tipo.id,
                                            'nombre', magnitud_tipo.nombre
                                        ) as magnitud_tipo
                                        from magnitud_tipo
                                        where magnitud_tipo.id = magnitud.magnitud_tipo_id
                                    )
                                ) as magnitud
                                from magnitud
                                where magnitud.id = bien.magnitud_id
                            ),
                            'bienMarca', (
                                select json_object(
                                    'id', bien_marca.id,
                                    'nombre', bien_marca.nombre
                                ) as bien_marca
                                from bien_marca
                                where bien_marca.id = bien.bien_marca_id
                            ),
                            'bienCategoria', (
                                select json_object(
                                    'id', bien_categoria.id,
                                    'nombre', bien_categoria.nombre
                                ) as bien_categoria
                                from bien_categoria
                                where bien_categoria.id = bien.bien_categoria_id
                            ),
                            'precioUnitario', producto.precio_uni,
                            'esSalida', producto.es_salida
                        ) as data
                        from producto
                        left join bien on bien.id = producto.id
                        left join elemento_economico on elemento_economico.id = bien.id
                        where producto.id = movimiento_producto_detalle.productoId
                    ),
                    'cantidad', movimiento_producto_detalle.cantidad,
                    'importeUnitario', movimiento_producto_detalle.importeUnitario,
                    'type', movimiento_producto_detalle.type
                ) )
                from movimiento_producto_detalle
                where movimiento_producto_detalle.movimientoProductoId = movimiento_producto.id
            ),
            'type', movimiento_producto.type
        ) as data
        from movimiento_producto
    `;


    constructor(
        private appService: AppService,
        private conectorService: ConectorService
    )
    {
        this.appService.register({
            movimientoProducto: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( 
                    s, 
                    MovimientoProducto.initialize([ Prop.setObject( s.json.movimientoProducto ) ])[0]
                ),
                createItem: s => this.createItem(
                    s, 
                    MovimientoProducto.initialize([ Prop.setObject( s.json.movimientoProducto ) ])[0]
                ),
                updateItemCancel: s => this.updateItemCancel(
                    s, 
                    MovimientoProducto.initialize([ Prop.setObject( s.json.movimientoProducto ) ])[0]
                ),
                deleteItem: s => this.deleteItem(
                    s, 
                    MovimientoProducto.initialize([ Prop.setObject( s.json.movimientoProducto ) ])[0]
                ),
            }
        })
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'documento_movimiento' );
    }


    async executeCreateCollection( s: SessionData, movimientosProducto: MovimientoProducto[] )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'documento_movimiento' )
            .values( movimientosProducto.map( movProducto => ({
                id: movProducto.id ?? null,
                uuid: movProducto.uuid ?? null,
                codigo: movProducto.codigo ?? null,
                f_emision: movProducto.fechaEmision ?? movProducto.documentoTransaccion?.fechaEmision ?? null,
                f_anulacion: movProducto.fechaAnulacion ?? movProducto.documentoTransaccion?.fechaAnulacion ?? null,
                usuario_id: s.usuario.id ?? null,
                concepto: movProducto.concepto ?? null,
                documento_transaccion_id: movProducto.documentoTransaccion?.id ?? null
            }) ) )
        });

        const entradasProducto = movimientosProducto.filter( item => item instanceof EntradaProducto );
        const salidasProducto = movimientosProducto.filter( item => item instanceof SalidaProducto );


        let affectedRows2 = 0;
        let affectedRows3 = 0;
        if ( entradasProducto.length > 0 ) {

            affectedRows2 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'entrada_producto' )
                .values( entradasProducto.map( entradaProducto => ({
                    id: entradaProducto.id ?? null,
                }) ) )
            });

            affectedRows3 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'entrada_producto_detalle' )
                .values( 
                    entradasProducto
                    .flatMap( entradaProducto => entradaProducto.detalles )
                    .map( detalle => ({
                        id: detalle.id ?? null,
                        entrada_producto_id: detalle.documentoMovimiento?.id ?? null,
                        producto_id: detalle.producto?.id ?? null,
                        cant: detalle.cantidad ?? 0,
                        costo_uni: detalle.importeUnitario ?? 0
                    }) ) 
                )
            });

        }


        let affectedRows4 = 0;
        let affectedRows5 = 0;
        if ( salidasProducto.length > 0 ) {

            affectedRows4 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'salida_producto' )
                .values( salidasProducto.map( salidaProducto => ({
                    id: salidaProducto.id ?? null,
                }) ) )
            });

            affectedRows5 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'salida_producto_detalle' )
                .values( 
                    salidasProducto
                    .flatMap( salidaProducto => salidaProducto.detalles )
                    .map( detalle => ({
                        id: detalle.id ?? null,
                        salida_producto_id: detalle.documentoMovimiento?.id ?? null,
                        producto_id: detalle.producto?.id ?? null,
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


    async executeDeleteCollection( s: SessionData, movimientosProducto: MovimientoProducto[] )
    {
        const ids = movimientosProducto.map( mov => Prop.setNumberStrict( mov.id ) )
                                        .filter( id => id !== undefined );

        const entradasProducto = movimientosProducto.filter( item => item instanceof EntradaProducto );
        const salidasProducto = movimientosProducto.filter( item => item instanceof SalidaProducto );


        let affectedRows1 = 0
        let affectedRows2 = 0
        if ( entradasProducto.length > 0 ) {

            affectedRows1 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'entrada_producto_detalle' )
                .where({
                    entrada_producto_id: ids
                })
            });

            affectedRows2 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'entrada_producto' )
                .where({
                    id: ids
                })
            });

        }


        let affectedRows3 = 0
        let affectedRows4 = 0
        if ( salidasProducto.length > 0 ) {

            affectedRows3 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'salida_producto_detalle' )
                .where({
                    salida_producto_id: ids
                })
            });

            affectedRows4 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.delete( 'salida_producto' )
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
            target: MovimientoProducto.initialize,
            transaction: s.transaction,
            query: this.query,
        });

        data.forEach( mov => mov.procesarInformacionMovimiento() );

        return data;
    }


    async getItem( s: SessionData, movimientoProducto: MovimientoProducto )
    {
        const data = await this.conectorService.executeQuery({
            target: MovimientoProducto.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                where movimiento_producto.id = :id
            `,
            parameters: {
                id: movimientoProducto.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[0].procesarInformacionMovimiento();
    }


    async createCollection( s: SessionData, movimientosProducto: MovimientoProducto[] )
    {
        
        const entradasProducto = movimientosProducto.filter( item => item instanceof EntradaProducto );
        const salidasProducto = movimientosProducto.filter( item => item instanceof SalidaProducto );


        const keysEntradaProducto: Parameters<MovimientoProducto['setRelation']>[0] = {
            id: await this.getId( s ),
            detalleId: await this.conectorService.getId( s.transaction, 'entrada_producto_detalle' )
        };

        entradasProducto.forEach( entradaProducto => {

            entradaProducto
            .setRelation( keysEntradaProducto )
            .set({
                uuid: v4(),
                codigo: `MOV-${entradaProducto.id}`
            })
            .procesarInformacionMovimiento();

        } )
        

        const keysSalidaProducto: Parameters<MovimientoProducto['setRelation']>[0] = {
            id: keysEntradaProducto.id,
            detalleId: await this.conectorService.getId( s.transaction, 'salida_producto_detalle' )
        };

        salidasProducto.forEach( salidaProducto => {
            
            salidaProducto
            .setRelation( keysSalidaProducto )
            .set({
                uuid: v4(),
                codigo: `MOV-${salidaProducto.id}`
            })
            .procesarInformacionMovimiento();

        } )

        await this.executeCreateCollection( s, [ ...entradasProducto, ...salidasProducto ] );

        return this.getCollection( s );
    }


    async createItem( s: SessionData, movimientoProducto: MovimientoProducto )
    {
        const id = await this.getId( s );

        movimientoProducto
        .set({
            id: id,
            uuid: v4(),
            codigo: `MOV-${id}`,
        })
        .setRelation({
            id: await this.getId( s ),
            detalleId: await this.conectorService.getId(
                s.transaction,
                movimientoProducto instanceof EntradaProducto
                    ? 'entrada_producto_detalle'
                    : 'salida_producto_detalle'
            )
        })
        .procesarInformacionMovimiento();

        await this.executeCreateCollection( s, [ movimientoProducto ] );

        return await this.getItem( s, movimientoProducto );
    }


    async updateItemCancel( s: SessionData, movimientoProducto: MovimientoProducto )
    {
        const movProducto2validate = await this.getItem( s, movimientoProducto );
        if ( movProducto2validate.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );

        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'documento_movimiento' )
            .set({
                f_anulacion: movimientoProducto.fechaAnulacion ?? null
            })
            .where({
                id: movimientoProducto.id ?? null
            })
        });


        if ( affectedRows1 === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, movimientoProducto );
    }


    async deleteItem( s: SessionData, movimientoProducto: MovimientoProducto )
    {
        const movimientoProducto2delete = await this.getItem( s, movimientoProducto );
        await this.executeDeleteCollection( s, [ movimientoProducto2delete ] );
    }
}