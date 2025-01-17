
-- LIQUIDACION TIPO
select json_object(
    'id', liquidacion_tipo.id,
    'nombre', liquidacion_tipo.nombre
)
from liquidacion_tipo;



-- NOTA
select json_object(
    'id', nota.id,
    'documentoTransaccion', null,
    'fechaCreacion', nota.f_creacion,
    'descripcion', nota.descripcion,
    'usuario', null
) as data
from nota;



-- CUOTA
select json_object(
    'numero', cuota.numero,
    'fechaInicio', cuota.f_inicio,
    'fechaV', null
)
from cuota_cobrar;


-- CARPETA
select json_object(
    'id', carpeta.id,
    'nombre', carpeta.nombre,
    'usuario', null,
    'documentosTransaccion', null
)
from carpeta;



-- NOTA VENTA
select json_object(
    'id', documento_transaccion.id,
    'uuid', documento_transaccion.uuid,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaActualizacion', documento_transaccion.f_actualizacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'usuario', null,
    'establecimiento', null,
    'concepto', documento_transaccion.concepto,
    'carpeta', null,

    'cliente', null,
    'receptorDocumentoIdentificacion', null,
    'receptorCodigo', nota_venta.receptor_cod,
    'receptorNombre', nota_venta.receptor_nombre,
    'receptorCelular', nota_venta.receptor_celular,
    'liquidacionTipo', null,
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
            'elementoEconomico', null,
            'concepto', nota_venta_detalle.concepto,
            'cantidad', nota_venta_detalle.cant,
            'precioUnitario', nota_venta_detalle.precio_uni,
            'descuento', nota_venta_detalle.descuento,
            'comentario', nota_venta_detalle.comentario
        ))
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    'notas', null
) as data
from nota_venta
left join documento_transaccion on documento_transaccion.id = nota_venta.id;



-- DOCUMENTO TRANSACCION
with cte_movimiento as (

    select
        documento_movimiento.documento_transaccion_id as documentoTransaccionId,
        sum( ifnull( entrada_efectivo.efectivo, 0 ) ) - sum( ifnull( salida_efectivo.efectivo, 0 ) ) as importeCobrado
    from documento_movimiento 
    left join entrada_efectivo on documento_movimiento.id = entrada_efectivo.id
    left join salida_efectivo on documento_movimiento.id = salida_efectivo.id
    where documento_movimiento.f_anulacion is null
    and documento_movimiento.documento_transaccion_id is not null
    group by documento_movimiento.documento_transaccion_id
    
),
cte_importe_transaccion as (

    select
        nota_venta.id as documentoTransaccionId,
        sum( ( ifnull( nota_venta_detalle.cant, 0 ) * ifnull( nota_venta_detalle.precio_uni, 0 ) ) - ifnull( nota_venta_detalle.descuento, 0 ) ) as importeNeto
    from nota_venta
    left join nota_venta_detalle on nota_venta_detalle.nota_venta_id = nota_venta.id
    group by nota_venta.id

),
cte_documento_transaccion as (

    select 
        documento_transaccion.id as id,
        nota_venta.cliente_id as clienteId,
        json_object(
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
            'establecimiento',(
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

            'importeNeto', cte_importe_transaccion.importeNeto,
            'importeCobrado', cte_movimiento.importeCobrado,
            'importePorCobrar', if( cte_importe_transaccion.importeNeto <= 0, 0, cte_importe_transaccion.importeNeto - cte_movimiento.importeCobrado ),
            'porcentajeCobrado', if( cte_importe_transaccion.importeNeto <= 0, 0, cte_movimiento.importeCobrado / cte_importe_transaccion.importeNeto * 100.00 ),
            'porcentajePorCobrar', if( cte_importe_transaccion.importeNeto <= 0, 0, 100.00 - ( cte_movimiento.importeCobrado / cte_importe_transaccion.importeNeto * 100.00 ) ),
            'type', 'NotaVenta'
        ) as json
    from nota_venta
    left join documento_transaccion on documento_transaccion.id = nota_venta.id
    left join cte_importe_transaccion on cte_importe_transaccion.documentoTransaccionId = documento_transaccion.id
    left join cte_movimiento on cte_movimiento.documentoTransaccionId = documento_transaccion.id

)
select
    cte_documento_transaccion.json
from cte_documento_transaccion
left join documento_transaccion on documento_transaccion.id = cte_documento_transaccion.id;



-- Documento Transaccion id
select json_object(
    'id', documento_transaccion.id,
    'uuid', documento_transaccion.uuid,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'fechaActualizacion', documento_transaccion.f_actualizacion,
    'usuario', null,
    'establecimiento', null,
    'concepto', documento_transaccion.concepto,
    'carpeta', null
)
from documento_transaccion;



--------------- PRUEBA NOTA DE VENTA

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
left join documento_transaccion on documento_transaccion.id = nota_venta.id;


-- elementos economicos sin type para nota venta
                select json_object(
                    'id', elemento_economico.id,
                    'uuid', elemento_economico.uuid,
                    'codigo', elemento_economico.codigo,
                    'nombre', cte_elemento_economico.nombre,
                    'magnitudNombre', cte_elemento_economico.magnitudNombre,
                    'categoria', cte_elemento_economico.categoria,
                    'precioUnitario', cte_elemento_economico.precioUnitario,
                    'esSalida', cte_elemento_economico.esSalida,
                    'type', cte_elemento_economico.type
                )
                from (
                    
                    select
                        servicio.id as id,
                        servicio.nombre as nombre,
                        'uni' as magnitudNombre,
                        servicio_categoria.nombre as categoria,
                        servicio.precio_uni as precioUnitario,
                        servicio.es_salida as esSalida,
                        'Servicio' as type
                    from servicio
                    left join servicio_categoria on servicio_categoria.id = servicio.servicio_categoria_id

                    union all

                    select
                        producto.id as id,
                        concat(
                            bien_marca.nombre, ' ',
                            bien.nombre
                        ) as nombre,
                        magnitud.nombre as magnitudNombre,
                        bien_categoria.nombre as categoria,
                        producto.precio_uni as precioUnitario,
                        producto.es_salida as esSalida,
                        'Producto' as type
                    from producto
                    left join bien on bien.id = producto.id
                    left join bien_marca on bien_marca.id = bien.bien_marca_id
                    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
                    left join magnitud on magnitud.id = bien.magnitud_id

                    union all

                    select
                        bien_capital.id as id,
                        concat(
                            bien_marca.nombre, ' ',
                            bien.nombre
                        ) as nombre,
                        magnitud.nombre as magnitudNombre,
                        bien_categoria.nombre as categoria,
                        bien_capital.valor_residual as precioUnitario,
                        bien_capital.es_salida as esSalida,
                        'BienCapital' as type
                    from bien_capital
                    left join bien on bien.id = bien_capital.id
                    left join bien_marca on bien_marca.id = bien.bien_marca_id
                    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
                    left join magnitud on magnitud.id = bien.magnitud_id
                    
                    union all

                    select
                        pantalla_modelo_calidad.id as id,
                        concat(
                            pantalla_marca.nombre, ' ',
                            pantalla_modelo.nombre, ' ',
                            calidad.nombre
                        ) as nombre,
                        'uni' as magnitudNombre,
                        'pantallas' as categoria,
                        pantalla_modelo_calidad.precio_uni as precioUnitario,
                        1 as esSalida,
                        'PantallaModeloCalidad' as type
                    from pantalla_modelo_calidad
                    left join pantalla_modelo on pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
                    left join pantalla_marca on pantalla_marca.id = pantalla_modelo.pantalla_marca_id
                    left join calidad on calidad.id = pantalla_modelo_calidad.calidad_id

                ) as cte_elemento_economico
                left join elemento_economico on elemento_economico.id = cte_elemento_economico.id
                where elemento_economico.id = nota_venta_detalle.elemento_economico_id
                order by elemento_economico.id

--
select
                    documento_transaccion.cod_numero as codigoNumero
                from nota_venta
                left join documento_transaccion on documento_transaccion.id = nota_venta.id
                where cod_serie = 'NTDVNT2025'
                order by cod_numero desc
                limit 1;

