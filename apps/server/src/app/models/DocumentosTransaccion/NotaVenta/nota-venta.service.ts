import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { NotaVenta, Prop } from '@app/models';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { v4 } from 'uuid';
import { NotaService } from '../nota.service';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { AppService } from '../../../app.service';
import { MovimientoEfectivoService } from '../../DocumentosMovimiento/MovimientoEfectivo/movimiento-efectivo.service';
import { MovimientoPantallaService } from '../../DocumentosMovimiento/MovimientoPantalla/movimiento-pantalla.service';
import { MovimientoProductoService } from '../../DocumentosMovimiento/MovimientoProducto/movimiento-producto.service';

@Injectable()
export class NotaVentaService {

    query = `
        select json_object(
            'id', documento_transaccion.id,
            'uuid', documento_transaccion.uuid,
            'codigoSerie', documento_transaccion.cod_serie,
            'codigoNumero', documento_transaccion.cod_numero,
            'fechaCreacion', documento_transaccion.f_creacion,
            'fechaActualizacion', documento_transaccion.f_actualizacion,
            'fechaEmision', documento_transaccion.f_emision,
            'fechaAnulacion', documento_transaccion.f_anulacion,
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
            'carpeta', null,

            'cliente', (
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
                where cliente.id = nota_venta.cliente_id
            ),
            'receptorDocumentoIdentificacion', (
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = nota_venta.receptor_documento_identificacion_id
            ),
            'receptorCodigo', nota_venta.receptor_cod,
            'receptorNombre', nota_venta.receptor_nombre,
            'receptorCelular', nota_venta.receptor_celular,
            'liquidacionTipo', (
                select json_object(
                    'id', liquidacion_tipo.id,
                    'nombre', liquidacion_tipo.nombre
                )
                from liquidacion_tipo
                where liquidacion_tipo.id = nota_venta.liquidacion_tipo_id
            ),
            'importeAnticipo', nota_venta.importe_anticipo,
            'credito', (
                select json_object(
                    'id', nota_venta_credito.id,
                    'tasaInteresDiario', nota_venta_credito.tasa_interes_diario,
                    'importeCapitalInicial', nota_venta_credito.importe_capital_inicial,
                    'importeInteres', nota_venta_credito.importe_interes,
                    'cuotas', (
                        select json_arrayagg( json_object(
                            'id', nota_venta_cuota.id,
                            'numero', nota_venta_cuota.numero,
                            'fechaInicio', nota_venta_cuota.f_inicio,
                            'fechaVencimiento', nota_venta_cuota.f_vencimiento,
                            'importeCuota', nota_venta_cuota.cuota,
                            'importeAmortizacion', nota_venta_cuota.amortizacion,
                            'importeInteres', nota_venta_cuota.interes,
                            'importeSaldo', nota_venta_cuota.saldo
                        ) )
                        from nota_venta_cuota
                        where nota_venta_cuota.nota_venta_credito_id = nota_venta_credito.id
                    )
                )
                from nota_venta_credito
                where nota_venta_credito.nota_venta_id = nota_venta.id
            ),

            'detalles', (
                select json_arrayagg(json_object(
                    'id', nota_venta_detalle.id,
                    'elementoEconomico', (
                        select
                            cte_elemento_economico.json
                        from (

                            select 
                                elemento_economico.id as id,
                                json_object(
                                    'id', servicio.id,
                                    'uuid', elemento_economico.uuid,
                                    'codigo', elemento_economico.codigo,
                                    'nombre', servicio.nombre,
                                    'servicioCategoria', (
                                        select json_object(
                                            'id', servicio_categoria.id,
                                            'nombre', servicio_categoria.nombre
                                        )
                                        from servicio_categoria
                                        where servicio_categoria.id = servicio.servicio_categoria_id
                                    ),
                                    'precioUnitario', servicio.precio_uni,
                                    'esSalida', servicio.es_salida,
                                    'type', 'Servicio',
                                    'magnitudNombre', 'uni',
                                    'categoriaNombre', (
                                        select 
                                            servicio_categoria.nombre
                                        from servicio_categoria
                                        where servicio_categoria.id = servicio.servicio_categoria_id
                                    )
                                ) as json
                            from servicio
                            left join elemento_economico on elemento_economico.id = servicio.id

                            union all

                            select 
                                elemento_economico.id as id,
                                json_object(
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
                                    'esSalida', producto.es_salida,
                                    'type', 'Producto',
                                    'magnitudNombre', (
                                        select 
                                            magnitud.nombre
                                        from magnitud
                                        where magnitud.id = bien.magnitud_id
                                    ),
                                    'categoriaNombre', (
                                        select 
                                            bien_categoria.nombre
                                        from bien_categoria
                                        where bien_categoria.id = bien.bien_categoria_id
                                    )
                                ) as json
                            from producto
                            left join bien on bien.id = producto.id
                            left join elemento_economico on elemento_economico.id = bien.id

                            union all

                            select 
                                elemento_economico.id as id,
                                json_object(
                                    'id', bien_capital.id,
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
                                    'fechaAlta', bien_capital.f_alta,
                                    'fechaBaja', bien_capital.f_baja,
                                    'valorInicial', bien_capital.valor_inicial,
                                    'valorResidual', bien_capital.valor_residual,
                                    'esSalida', bien_capital.es_salida,
                                    'type', 'BienCapital',
                                    'magnitudNombre', (
                                        select 
                                            magnitud.nombre
                                        from magnitud
                                        where magnitud.id = bien.magnitud_id
                                    ),
                                    'categoriaNombre', (
                                        select 
                                            bien_categoria.nombre
                                        from bien_categoria
                                        where bien_categoria.id = bien.bien_categoria_id
                                    )
                                ) as json
                            from bien_capital
                            left join bien on bien.id = bien_capital.id
                            left join elemento_economico on elemento_economico.id = bien.id

                            union all

                            select 
                                elemento_economico.id as id,
                                json_object(
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
                                    'precioUnitario', pantalla_modelo_calidad.precio_uni,
                                    'type', 'PantallaModeloCalidad',
                                    'nombre', (
                                        select
                                            concat(
                                                pantalla_marca.nombre, ' ',
                                                pantalla_modelo.nombre, ' ',
                                                calidad.nombre
                                            ) as nombre
                                        from pantalla_modelo 
                                        left join pantalla_marca on pantalla_marca.id = pantalla_modelo.pantalla_marca_id
                                        left join calidad on calidad.id = pantalla_modelo_calidad.calidad_id
                                        where pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
                                    ),
                                    'magnitudNombre', 'uni',
                                    'categoriaNombre', 'pantallas'
                                ) as json
                            from pantalla_modelo_calidad
                            left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id

                        ) as cte_elemento_economico
                        where cte_elemento_economico.id = nota_venta_detalle.elemento_economico_id
                        order by cte_elemento_economico.id
                    ),
                    'concepto', nota_venta_detalle.concepto,
                    'cantidad', nota_venta_detalle.cant,
                    'importeUnitario', nota_venta_detalle.precio_uni,
                    'importeDescuento', nota_venta_detalle.descuento,
                    'comentario', nota_venta_detalle.comentario
                ))
                from nota_venta_detalle
                where nota_venta_detalle.nota_venta_id = nota_venta.id
            ),
            'notas', (
                select json_arrayagg( sub_nota.data )
                from (
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
                    where nota.documento_transaccion_id = documento_transaccion.id
                    order by nota.f_creacion desc
                ) as sub_nota
            ),
            'movimientosEfectivo', (
                select json_arrayagg( json_object(
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
                    'medioTransferencia', (
                        select json_object(
                            'id', medio_transferencia.id,
                            'nombre', medio_transferencia.nombre
                        )
                        from medio_transferencia
                        where medio_transferencia.id = movimiento_efectivo.medioTransferenciaId
                    ),
                    'documentoTransaccion', null,
                    'type', movimiento_efectivo.type
                ) ) as data
                from (

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

                ) as movimiento_efectivo
                left join documento_movimiento on documento_movimiento.id = movimiento_efectivo.id
                left join medio_transferencia on medio_transferencia.id = movimiento_efectivo.medioTransferenciaId
                where documento_movimiento.documento_transaccion_id = documento_transaccion.id
            ),
            'movimientosPantalla', (

                select json_arrayagg( json_object(
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
                    'documentoTransaccion', null,
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
                        from (

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

                        ) as movimiento_pantalla_detalle
                        where movimiento_pantalla_detalle.movimientoPantallaId = movimiento_pantalla.id
                    ),
                    'type', movimiento_pantalla.type
                ) )
                from (

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

                ) as movimiento_pantalla
                where movimiento_pantalla.documentoTransaccionId = documento_transaccion.id

            ),
            'movimientosProducto', (

                select json_arrayagg( json_object(
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
                    'documentoTransaccion', null,
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
                        from (

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

                        ) as movimiento_producto_detalle
                        where movimiento_producto_detalle.movimientoProductoId = movimiento_producto.id
                    ),
                    'type', movimiento_producto.type
                ) )
                from (

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

                ) as movimiento_producto
                where movimiento_producto.documentoTransaccionId = documento_transaccion.id

            )
        ) as data
        from nota_venta
        left join documento_transaccion on documento_transaccion.id = nota_venta.id
    `;


    constructor(
        private appService: AppService,
        private conectorService: ConectorService,
        private notaService: NotaService, 
        private movimientoEfectivoService: MovimientoEfectivoService,
        private movimientoPantallaService: MovimientoPantallaService,
        private movimientoProductoService: MovimientoProductoService,
    )
    {
        this.appService.register({
            notaVenta: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new NotaVenta( s.json.notaVenta ) ),
                createItem: s => this.createItem( s, new NotaVenta( s.json.notaVenta ) ),
                updateItem: s => this.updateItem( s, new NotaVenta( s.json.notaVenta ) ),
                updateItemCancel: s => this.updateItemCancel( s, new NotaVenta( s.json.notaVenta ) ),
                deleteItem: s => this.deleteItem( s, new NotaVenta( s.json.notaVenta ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'documento_transaccion' );
    }


    async executeCreateCollection( s: SessionData, notasVenta: NotaVenta[] )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'documento_transaccion' )
            .values( notasVenta.map( notaVenta => (
                {
                    id: notaVenta.id ?? null,
                    uuid: notaVenta.uuid ?? null,
                    cod_serie: notaVenta.codigoSerie ?? null,
                    cod_numero: notaVenta.codigoNumero ?? null,
                    f_creacion: notaVenta.fechaCreacion ?? null,
                    f_actualizacion: notaVenta.fechaActualizacion ?? null,
                    f_emision: notaVenta.fechaEmision ?? null,
                    f_anulacion: notaVenta.fechaAnulacion ?? null,
                    usuario_id: s.usuario.id ?? null,
                    concepto: notaVenta.concepto ?? null,
                    carpeta_id: notaVenta.carpeta?.id ?? null
                }
            ) ) )
        });

        
        let affectedRows2 = 0;
        const notas = notasVenta.flatMap( nota => nota.notas );
        if ( notas.length > 0 ) {

            affectedRows2 = await this.notaService.executeCreateCollection( s, notas );

        }


        const affectedRows3 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'nota_venta' )
            .values( 
                notasVenta
                .map( notaVenta => (
                    {
                        id: notaVenta.id ?? null,
                        cliente_id: notaVenta.cliente?.id ?? null,
                        receptor_documento_identificacion_id: notaVenta.cliente?.id
                                                                ? null
                                                                : ( notaVenta.receptorDocumentoIdentificacion?.id ?? null ),
                        receptor_cod: notaVenta.cliente?.id
                                        ? null
                                        : ( notaVenta.receptorCodigo ?? null ),
                        receptor_nombre: notaVenta.cliente?.id
                                        ? null
                                        : ( notaVenta.receptorNombre ?? null ),
                        receptor_celular: notaVenta.cliente?.id
                                        ? null
                                        : ( notaVenta.receptorCelular ?? null ),
                        liquidacion_tipo_id: notaVenta.liquidacionTipo?.id ?? 1,
                        importe_anticipo: notaVenta.importeAnticipo ?? 0
                    }
                ) )
            )
        });


        let affectedRows4 = 0;
        const notaVentaDetalles = notasVenta.flatMap( notaVenta => notaVenta.detalles );
        if ( notaVentaDetalles.length > 0 ) {

            affectedRows4 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'nota_venta_detalle' )
                .values( 
                    notaVentaDetalles
                    .map( detalle => (
                        {
                            id: detalle.id ?? null,
                            nota_venta_id: detalle.notaVenta?.id ?? null,
                            elemento_economico_id: detalle.elementoEconomico?.id ?? null,
                            concepto: detalle.concepto ?? null,
                            cant: Prop.setNumberStrict( detalle.cantidad ) ?? 0,
                            precio_uni: Prop.setNumberStrict( detalle.importeUnitario ) ?? 0,
                            descuento: Prop.setNumberStrict( detalle.importeDescuento ) ?? 0,
                            comentario: detalle.comentario ?? null
                        }
                    ) ) 
                )
            });
        }


        let affectedRows5 = 0;
        let affectedRows6 = 0;
        const notaVentaCreditos = notasVenta
                                    .filter( notaVenta => notaVenta.liquidacionTipo?.id === 2 )
                                    .flatMap( notaVenta => notaVenta.credito );
        if ( notaVentaCreditos.length > 0 ) {

            affectedRows5 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder
                .insert( 'nota_venta_credito' )
                .values(
                    notaVentaCreditos
                    .map( notaVentaCredito => (
                        {
                            id: notaVentaCredito.id ?? null,
                            nota_venta_id: notaVentaCredito.documentoTransaccion?.id ?? null,
                            tasa_interes_diario: Prop.setNumberStrict( notaVentaCredito.tasaInteresDiario ) ?? 0,
                            importe_capital_inicial: Prop.setNumberStrict( notaVentaCredito.importeCapitalInicial ) ?? 0,
                            importe_interes: Prop.setNumberStrict( notaVentaCredito.importeInteres ) ?? 0
                        }
                    ) )
                )
            });


            const notaVentaCuotas = notaVentaCreditos.flatMap( notaVentaCredito => notaVentaCredito.cuotas );
            if ( notaVentaCuotas.length > 0 ) {

                affectedRows6 = await this.conectorService.executeNonQuery({
                    transaction: s.transaction,
                    ...SQLBuilder.insert( 'nota_venta_cuota' )
                    .values(
                        notaVentaCuotas.map( notaVentaCuota => (
                            {
                                id: notaVentaCuota.id ?? null,
                                nota_venta_credito_id: notaVentaCuota.credito?.id ?? null,
                                numero: notaVentaCuota.numero ?? 0,
                                f_inicio: notaVentaCuota.fechaInicio ?? null,
                                f_vencimiento: notaVentaCuota.fechaVencimiento ?? null,
                                cuota: Prop.setNumberStrict( notaVentaCuota.importeCuota ) ?? 0,
                                amortizacion: Prop.setNumberStrict( notaVentaCuota.importeAmortizacion ) ?? 0,
                                interes: Prop.setNumberStrict( notaVentaCuota.importeInteres ) ?? 0,
                                saldo: Prop.setNumberStrict( notaVentaCuota.importeSaldo ) ?? 0
                            }
                        ) )
                    )
                });
            }

        }
        

        let affectedRows7 = 0;
        const movimientoEfectivo = notasVenta.filter( notaVenta => notaVenta.fechaEmision )
                                    .flatMap( notaVenta => notaVenta.movimientosEfectivo );
        if ( movimientoEfectivo.length > 0 ) {
            
            await this.movimientoEfectivoService.executeCreateCollection( s, movimientoEfectivo );
            affectedRows7 = 1;
            
        }
        
        
        let affectedRows8 = 0;
        const movimientosPantalla = notasVenta.filter( notaVenta => notaVenta.fechaEmision )
                                    .flatMap( notaVenta => notaVenta.movimientosPantalla );
        if ( movimientosPantalla.length > 0 ) {
            
            await this.movimientoPantallaService.executeCreateCollection( s, movimientosPantalla );
            affectedRows8 = 1;
            
        }
        
        
        let affectedRows9 = 0;
        const movimientosProducto = notasVenta.filter( notaVenta => notaVenta.fechaEmision )
                                    .flatMap( notaVenta => notaVenta.movimientosProducto );
        if ( movimientosProducto.length > 0 ) {

            await this.movimientoProductoService.executeCreateCollection( s, movimientosProducto );
            affectedRows9 = 1;

        }


        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0 &&
            affectedRows4 === 0 &&
            affectedRows5 === 0 &&
            affectedRows6 === 0 &&
            affectedRows7 === 0 &&
            affectedRows8 === 0 &&
            affectedRows9 === 0 
        ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
    }


    async executeDeleteCollection( s: SessionData, notasVenta: NotaVenta[] )
    {
        const ids = notasVenta
                    .map( notaVenta => Prop.setNumberStrict( notaVenta.id ) )
                    .filter( id => id !== undefined )
            
        console.log( ids );

        // query prueba

        // movimientos efectivo
        const af11 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete entrada_efectivo
                from entrada_efectivo
                left join documento_movimiento on documento_movimiento.id = entrada_efectivo.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af12 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete salida_efectivo
                from salida_efectivo
                left join documento_movimiento on documento_movimiento.id = salida_efectivo.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        // movimientos pantalla
        const af13 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete entrada_pantalla_detalle
                from entrada_pantalla_detalle
                left join entrada_pantalla on entrada_pantalla.id = entrada_pantalla_detalle.entrada_pantalla_id
                left join documento_movimiento on documento_movimiento.id = entrada_pantalla.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af14 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete entrada_pantalla
                from entrada_pantalla
                left join documento_movimiento on documento_movimiento.id = entrada_pantalla.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af15 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete salida_pantalla_detalle
                from salida_pantalla_detalle
                left join salida_pantalla on salida_pantalla.id = salida_pantalla_detalle.salida_pantalla_id
                left join documento_movimiento on documento_movimiento.id = salida_pantalla.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af16 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete salida_pantalla
                from salida_pantalla
                left join documento_movimiento on documento_movimiento.id = salida_pantalla.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        // movimientos producto
        const af17 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete entrada_producto_detalle
                from entrada_producto_detalle
                left join entrada_producto on entrada_producto.id = entrada_producto_detalle.entrada_producto_id
                left join documento_movimiento on documento_movimiento.id = entrada_producto.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af18 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete entrada_producto
                from entrada_producto
                left join documento_movimiento on documento_movimiento.id = entrada_producto.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af19 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete salida_producto_detalle
                from salida_producto_detalle
                left join salida_producto on salida_producto.id = salida_producto_detalle.salida_producto_id
                left join documento_movimiento on documento_movimiento.id = salida_producto.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af20 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete salida_producto
                from salida_producto
                left join documento_movimiento on documento_movimiento.id = salida_producto.id
                where documento_movimiento.documento_transaccion_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });

        const af21 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'documento_movimiento' )
            .where({
                documento_transaccion_id: ids
            })
        });
        // FIN QUERY PRUEBA

        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete nota_venta_cuota
                from nota_venta_cuota
                left join nota_venta_credito on nota_venta_credito.id = nota_venta_cuota.nota_venta_credito_id
                where nota_venta_credito.nota_venta_id in ( :ids )
            `,
            parameters: {
                ids: ids
            }
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'nota_venta_credito' )
            .where({
                nota_venta_id: ids
            })
        });


        const affectedRows3 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'nota_venta_detalle' )
            .where({
                nota_venta_id: ids
            })
        });


        const affectedRows4 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'nota_venta' )
            .where({
                id: ids
            })
        });


        const affectedRows5 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'nota' )
            .where({
                documento_transaccion_id: ids
            })
        });


        const affectedRows6 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'documento_transaccion' )
            .where({
                id: ids
            })
        });


        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0 &&
            affectedRows4 === 0 &&
            affectedRows5 === 0 &&
            affectedRows6 === 0 
        ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }


    async getCollection( s: SessionData )
    {
        const data = await this.conectorService.executeQuery({
            target: NotaVenta,
            transaction: s.transaction,
            query: this.query
        });

        data.forEach( notaVenta => notaVenta.procesarInformacion() );

        return data;
    }


    async getItem( s: SessionData, notaVenta: NotaVenta )
    {
        const data = await this.conectorService.executeQuery({
            target: NotaVenta,
            transaction: s.transaction,
            query: `
                ${this.query}
                where nota_venta.id = :id
            `,
            parameters: {
                id: notaVenta.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        // console.log( JSON.stringify(data[0]) ) 
        // console.log( data[0].movimientosEfectivo )
        // console.log( data[0].movimientosPantalla )
        // console.log( data[0].movimientosProducto )

        return data[ 0 ].procesarInformacion();
    }


    async generateCode( s: SessionData, notaVenta: NotaVenta )
    {
        const dateTimeEmision = Prop.toDateTime( notaVenta.fechaEmision );
        if ( !dateTimeEmision.isValid ) throw new InternalServerErrorException( 'Fecha de emisión inválido de la Nota de Venta.' )

        const codigoSerie = `NTDVNT${ dateTimeEmision.toFormat( 'yyyy' ) }`;
        
        const data: Array<{ codigoNumero: number } | undefined> = await this.conectorService.executeQuery({
            transaction: s.transaction,
            query: `
                select
                    documento_transaccion.cod_numero as codigoNumero
                from nota_venta
                left join documento_transaccion on documento_transaccion.id = nota_venta.id
                where cod_serie = :codigoSerie
                order by cod_numero desc
                limit 1
            `,
            parameters: {
                codigoSerie: codigoSerie
            }
        });

        console.log( data );
        
        const codigoNumero = ( Prop.setNumberStrict( data[0]?.codigoNumero ) ?? 0 ) +1;

        console.log({ codigoSerie, codigoNumero })

        return { codigoSerie, codigoNumero };
    }


    async createItem( s: SessionData, notaVenta: NotaVenta )
    {

        notaVenta.set({
            uuid: v4()
        })
        .setRelation({
            id: await this.getId( s ),
            notaId: await this.conectorService.getId( s.transaction, 'nota' ),
            detalleId: await this.conectorService.getId( s.transaction, 'nota_venta_detalle' ),
            creditoId: await this.conectorService.getId( s.transaction, 'nota_venta_credito' ),
            cuotaId: await this.conectorService.getId( s.transaction, 'nota_venta_cuota' ),
            documentoMovimientoId: await this.conectorService.getId( s.transaction, 'documento_movimiento' ),
            entradaPantallaDetalleId: await this.conectorService.getId( s.transaction, 'entrada_pantalla_detalle' ),
            salidaPantallaDetalleId: await this.conectorService.getId( s.transaction, 'salida_pantalla_detalle' ),
            entradaProductoDetalleId: await this.conectorService.getId( s.transaction, 'entrada_producto_detalle' ),
            salidaProductoDetalleId: await this.conectorService.getId( s.transaction, 'salida_producto_detalle' )
        })

        if ( notaVenta.fechaAnulacion ) {

            notaVenta.set({
                movimientosEfectivo: notaVenta.movimientosEfectivo.map( movEfectivo => movEfectivo.set({
                    fechaAnulacion: movEfectivo.fechaAnulacion ?? notaVenta.fechaAnulacion
                }) ),
                movimientosPantalla: notaVenta.movimientosPantalla.map( movPantalla => movPantalla.set({
                    fechaAnulacion: movPantalla.fechaAnulacion ?? notaVenta.fechaAnulacion
                }) ),
                movimientosProducto: notaVenta.movimientosProducto.map( movProducto => movProducto.set({
                    fechaAnulacion: movProducto.fechaAnulacion ?? notaVenta.fechaAnulacion
                }) ),
            })

        }


        if ( notaVenta.fechaEmision ) {

            if (
                [
                    notaVenta.movimientosEfectivo,
                    notaVenta.movimientosPantalla,
                    notaVenta.movimientosProducto
                ].length > 0 &&
                notaVenta.fechaEmision === undefined
            ) throw new InternalServerErrorException( 'Hay movimientos confirmados y Nota de Venta sin fecha de emisión.' )

            const codigos = await this.generateCode( s, notaVenta );

            notaVenta.set({
                codigoSerie: codigos.codigoSerie,
                codigoNumero: codigos.codigoNumero,
                movimientosEfectivo: notaVenta.movimientosEfectivo.map( movEfectivo => movEfectivo.set({
                    uuid: v4(),
                    codigo: `MOV-${movEfectivo.id}`,
                    fechaEmision: movEfectivo.fechaEmision ?? notaVenta.fechaEmision,
                }) ),
                movimientosPantalla: notaVenta.movimientosPantalla.map( movPantalla => movPantalla.set({
                    uuid: v4(),
                    codigo: `MOV-${movPantalla.id}`,
                    fechaEmision: movPantalla.fechaEmision ?? notaVenta.fechaEmision
                }) ),
                movimientosProducto: notaVenta.movimientosProducto.map( movProducto => movProducto.set({
                    uuid: v4(),
                    codigo: `MOV-${movProducto.id}`,
                    fechaEmision: movProducto.fechaEmision ?? notaVenta.fechaEmision
                }) )
                
            })

        }


        notaVenta.setRelation()
        .procesarInformacion();

        await this.executeCreateCollection( s, [ notaVenta ] );
        
        return await this.getItem( s, notaVenta );
    }


    async updateItem( s: SessionData, notaVenta: NotaVenta )
    {
        const notaVenta2verify = await this.getItem( s, notaVenta );
        if ( notaVenta2verify.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );
        if ( notaVenta2verify.fechaEmision ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_EMITIDO );

        try {

            await this.deleteItem( s, notaVenta2verify );

            notaVenta.set({
                id: notaVenta2verify.id,
                uuid: notaVenta2verify.uuid
            })
            .setRelation({
                id: notaVenta2verify.id ?? NaN,
                notaId: await this.conectorService.getId( s.transaction, 'nota' ),
                detalleId: await this.conectorService.getId( s.transaction, 'nota_venta_detalle' ),
                creditoId: await this.conectorService.getId( s.transaction, 'nota_venta_credito' ),
                cuotaId: await this.conectorService.getId( s.transaction, 'nota_venta_cuota' ),
                documentoMovimientoId: await this.conectorService.getId( s.transaction, 'documento_movimiento' ),
                entradaPantallaDetalleId: await this.conectorService.getId( s.transaction, 'entrada_pantalla_detalle' ),
                salidaPantallaDetalleId: await this.conectorService.getId( s.transaction, 'salida_pantalla_detalle' ),
                entradaProductoDetalleId: await this.conectorService.getId( s.transaction, 'entrada_producto_detalle' ),
                salidaProductoDetalleId: await this.conectorService.getId( s.transaction, 'salida_producto_detalle' )
            })
    

            if ( notaVenta.fechaAnulacion ) {
    
                notaVenta.set({
                    movimientosEfectivo: notaVenta.movimientosEfectivo.map( movEfectivo => movEfectivo.set({
                        fechaAnulacion: movEfectivo.fechaAnulacion ?? notaVenta.fechaAnulacion
                    }) ),
                    movimientosPantalla: notaVenta.movimientosPantalla.map( movPantalla => movPantalla.set({
                        fechaAnulacion: movPantalla.fechaAnulacion ?? notaVenta.fechaAnulacion
                    }) ),
                    movimientosProducto: notaVenta.movimientosProducto.map( movProducto => movProducto.set({
                        fechaAnulacion: movProducto.fechaAnulacion ?? notaVenta.fechaAnulacion
                    }) ),
                })
    
            }
    
    
            if ( notaVenta.fechaEmision ) {

                if (
                    [
                        notaVenta.movimientosEfectivo,
                        notaVenta.movimientosPantalla,
                        notaVenta.movimientosProducto
                    ].length > 0 &&
                    notaVenta.fechaEmision === undefined
                ) throw new InternalServerErrorException( 'Hay movimientos confirmados y Nota de Venta sin fecha de emisión.' )
    
                const codigos = await this.generateCode( s, notaVenta );
    
                notaVenta.set({
                    codigoSerie: codigos.codigoSerie,
                    codigoNumero: codigos.codigoNumero,
                    movimientosEfectivo: notaVenta.movimientosEfectivo.map( movEfectivo => movEfectivo.set({
                        uuid: v4(),
                        codigo: `MOV-${movEfectivo.id}`,
                        fechaEmision: movEfectivo.fechaEmision ?? notaVenta.fechaEmision,
                    }) ),
                    movimientosPantalla: notaVenta.movimientosPantalla.map( movPantalla => movPantalla.set({
                        uuid: v4(),
                        codigo: `MOV-${movPantalla.id}`,
                        fechaEmision: movPantalla.fechaEmision ?? notaVenta.fechaEmision
                    }) ),
                    movimientosProducto: notaVenta.movimientosProducto.map( movProducto => movProducto.set({
                        uuid: v4(),
                        codigo: `MOV-${movProducto.id}`,
                        fechaEmision: movProducto.fechaEmision ?? notaVenta.fechaEmision
                    }) )
                    
                })
    
            }
            
    
            notaVenta.setRelation()
            .procesarInformacion();


            await this.executeCreateCollection( s, [ notaVenta ] );

            return await this.getItem( s, notaVenta );

        }
        catch ( error ) {
            console.log( error )
            throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        }
    }


    async updateItemIssue( s: SessionData, notaVenta: NotaVenta )
    {
        let existe = false;
        let notaVenta2verify = notaVenta;

        try {
            notaVenta2verify = await this.getItem( s, notaVenta );
            existe = true;
        }
        catch ( error: any ) {
            existe = false;
        }


        const codigos = await this.generateCode( s, notaVenta );

        if ( existe ) {

            if ( notaVenta2verify.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );
            if ( notaVenta2verify.fechaEmision ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_EMITIDO );
    
            notaVenta.set({
                codigoSerie: codigos.codigoSerie,
                codigoNumero: codigos.codigoNumero
            });
    
            const affectedRows1 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.update( 'documento_transaccion' )
                .set({
                    cod_serie: notaVenta.codigoSerie,
                    cod_numero: notaVenta.codigoNumero,
                    f_actualizacion: notaVenta.fechaActualizacion ?? null,
                    f_emision: notaVenta.fechaEmision ?? null,
                })
                .where({
                    id: notaVenta.id
                })
            });

            const affectedRows2 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.update( 'documento_movimiento' )
                .set({
                    f_emision: notaVenta.fechaEmision ?? null,
                })
                .where({
                    documento_transaccion_id: notaVenta.id ?? null
                })
            });


            if (
                affectedRows1 === 0 &&
                affectedRows2 === 0
            ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
    
            return await this.getItem( s, notaVenta );    

        }
        else {

            notaVenta.set({
                codigoSerie: codigos.codigoSerie,
                codigoNumero: codigos.codigoNumero
            });

            return await this.createItem( s, notaVenta );

        }
        
    }


    async updateItemCancel( s: SessionData, notaVenta: NotaVenta )
    {
        const notaVenta2verify = await this.getItem( s, notaVenta );
        if ( notaVenta2verify.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );

        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'documento_transaccion' )
            .set({
                f_actualizacion: notaVenta.fechaActualizacion ?? null,
                f_anulacion: notaVenta.fechaAnulacion ?? null,
            })
            .where({
                id: notaVenta.id ?? null
            })
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                update documento_movimiento set
                    f_anulacion = :fechaAnulacion
                where documento_transaccion_id = :id
                and f_anulacion is null
            `,
            parameters: {
                id: notaVenta.id ?? null,
                fechaAnulacion: notaVenta.fechaAnulacion ?? null
            }
        })


        if (
            affectedRows1 === 0 &&
            affectedRows2 === 0 
        ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );

        return await this.getItem( s, notaVenta );
    }


    async deleteItem( s: SessionData, notaVenta: NotaVenta )
    {
        const notaVenta2delete = await this.getItem( s, notaVenta );
        // if ( notaVenta2delete.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );
        // if ( notaVenta2delete.fechaEmision ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_EMITIDO );

        await this.executeDeleteCollection( s, [ notaVenta2delete ] );
        
    }   
}