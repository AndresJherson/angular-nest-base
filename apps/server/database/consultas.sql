use servicio_tecnico;


-- -- usuario
-- select json_object(
--     'id', usuario.id,
--     'documentoIdentificacion',(
--         select json_object(
--             'id', documento_identificacion.id,
--             'nombre', documento_identificacion.nombre
--         ) as documentoIdentificacion
--         from documento_identificacion
--         where documento_identificacion.id = usuario.documento_identificacion_id
--     ),
--     'codigo', usuario.cod,
--     'nombre', usuario.nombre,
--     'apellido', usuario.apellido,
--     'usuario', usuario.usuario,
--     'contrasena', usuario.contrasena,
--     'estado', (
--         select json_object(
--             'id', estado.id,
--             'nombre', estado.nombre
--         ) as estado
--         from estado
--         where estado.id = usuario.estado_id
--     )
-- ) as usuario
-- from usuario;


-- documento_identificacion
-- select json_object(
--     'id', documento_identificacion.id,
--     'nombre', documento_identificacion.nombre
-- ) as documentoIdentificacion
-- from documento_identificacion;


-- -- genero
-- select json_object(
--     'id', genero.id,
--     'nombre', genero.nombre
-- ) as genero
-- from genero;

-- -- cliente
-- select json_object(
--     'id', cliente.id,
--     'documentoIdentificacion',(
--         select json_object(
--             'id', documento_identificacion.id,
--             'nombre', documento_identificacion.nombre
--         ) as documentoIdentificacion
--         from documento_identificacion
--         where documento_identificacion.id = cliente.documento_identificacion_id
--     ),
--     'codigo', cliente.codigo,
--     'nombre', cliente.nombre,
--     'apellido', cliente.apellido,
--     'genero', (
--         select json_object(
--             'id', genero.id,
--             'nombre', genero.nombre
--         ) as genero
--         from genero
--         where genero.id = cliente.genero_id
--     ),
--     'celular', cliente.celular,
--     'celularRespaldo', cliente.celular_respaldo
-- ) as cliente
-- from cliente;



-- -- magnitud tipo
-- select json_object(
--     'id', magnitud_tipo.id,
--     'nombre', magnitud_tipo.nombre
-- ) as magnitudTipo
-- from magnitud_tipo;

-- -- magnitud
-- select json_object(
--     'id', magnitud.id,
--     'nombre', magnitud.nombre,
--     'magnitudTipo', (
--         select json_object(
--             'id', magnitud_tipo.id,
--             'nombre', magnitud_tipo.nombre
--         ) as magnitudTipo
--         from magnitud_tipo
--         where magnitud_tipo.id = magnitud.magnitud_tipo_id
--     )
-- ) as magnitud
-- from magnitud;

-- elemento economico
-- with cte_elemento_economico as (

--     select
--         pantalla_modelo_calidad.id as id,
--         elemento_economico.codigo as codigo,
--         concat(
--             pantalla_marca.nombre, ' ',
--             pantalla_modelo.nombre, ' ',
--             calidad.nombre
--         ) as nombre,
--         'uni' as magnitudNombre,
--         'pantalla celular' as categoria,
--         pantalla_modelo_calidad.precio_uni as precioUnitario,
--         pantalla_modelo_calidad.estado_id as estadoId,
--         'PantallaModeloCalidad' as type
--     from pantalla_modelo_calidad
--     left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id
--     left join pantalla_modelo on pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
--     left join pantalla_marca on pantalla_marca.id = pantalla_modelo.pantalla_marca_id
--     left join calidad on calidad.id = pantalla_modelo_calidad.calidad_id

--     union all
    
--     select
--         producto.id as id,
--         elemento_economico.codigo as codigo,
--         concat(
--             bien_marca.nombre, ' ',
--             bien.nombre
--         ) as nombre,
--         magnitud.nombre as magnitudNombre,
--         bien_categoria.nombre as categoria,
--         producto.precio_uni as precioUnitario,
--         producto.estado_id as estadoId,
--         'Producto' as type
--     from producto
--     left join bien on bien.id = producto.id
--     left join elemento_economico on elemento_economico.id = bien.id
--     left join bien_marca on bien_marca.id = bien.bien_marca_id
--     left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
--     left join magnitud on magnitud.id = bien.magnitud_id
    
--     union all
    
--     select
--         bien_capital.id as id,
--         elemento_economico.codigo as codigo,
--         concat(
--             bien_marca.nombre, ' ',
--             bien.nombre, ' ',
--             magnitud.nombre
--         ) as nombre,
--         magnitud.nombre as magnitudNombre,
--         bien_categoria.nombre as categoria,
--         bien_capital.valor_residual as precioUnitario,
--         bien_capital.estado_id as estadoId,
--         'BienCapital' as type
--     from bien_capital
--     left join bien on bien.id = bien_capital.id
--     left join elemento_economico on elemento_economico.id = bien.id
--     left join bien_marca on bien_marca.id = bien.bien_marca_id
--     left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
--     left join magnitud on magnitud.id = bien.magnitud_id
    
--     union all
    
--     select
--         servicio.id as id,
--         elemento_economico.codigo as codigo,
--         servicio.nombre as nombre,
--         'uni' as magnitudNombre,
--         servicio_categoria.nombre as categoria,
--         servicio.precio_uni as precioUnitario,
--         servicio.estado_id as estadoId,
--         'Servicio' as type
--     from servicio
--     left join elemento_economico on elemento_economico.id = servicio.id
--     left join servicio_categoria on servicio_categoria.id = servicio.servicio_categoria_id
    
-- )
-- select json_object(
--     'id', cte_elemento_economico.id,
--     'codigo', cte_elemento_economico.codigo,
--     'nombre', cte_elemento_economico.nombre,
--     'magnitudNombre', cte_elemento_economico.magnitudNombre,
--     'categoria', cte_elemento_economico.categoria,
--     'precioUnitario', cte_elemento_economico.precioUnitario,
--     'estado', (
--         select json_object(
--             'id', estado.id,
--             'nombre', estado.nombre
--         ) as estado
--         from estado
--         where estado.id = cte_elemento_economico.estadoId
--     ),
--     'type', cte_elemento_economico.type
-- ) as elementoEconomico
-- from cte_elemento_economico;


-- -- bien marca
-- select json_object(
--     'id', bien_marca.id,
--     'nombre', bien_marca.nombre
-- ) as bienMarca
-- from bien_marca;

-- -- bien categoria
-- select json_object(
--     'id', bien_categoria.id,
--     'nombre', bien_categoria.nombre
-- ) as bienCategoria
-- from bien_categoria;

-- -- producto
-- select json_object(
--     'id', producto.id,
--     'codigo', elemento_economico.codigo,
--     'nombre', bien.nombre,
--     'magnitud', (
--         select json_object(
--             'id', magnitud.id,
--             'nombre', magnitud.nombre,
--             'magnitudTipo', (
--                 select json_object(
--                     'id', magnitud_tipo.id,
--                     'nombre', magnitud_tipo.nombre
--                 ) as magnitud_tipo
--                 from magnitud_tipo
--                 where magnitud_tipo.id = magnitud.magnitud_tipo_id
--             )
--         ) as magnitud
--         from magnitud
--         where magnitud.id = bien.magnitud_id
--     ),
--     'bienMarca', (
--         select json_object(
--             'id', bien_marca.id,
--             'nombre', bien_marca.nombre
--         ) as bien_marca
--         from bien_marca
--         where bien_marca.id = bien.bien_marca_id
--     ),
--     'bienCategoria', (
--         select json_object(
--             'id', bien_categoria.id,
--             'nombre', bien_categoria.nombre
--         ) as bien_categoria
--         from bien_categoria
--         where bien_categoria.id = bien.bien_categoria_id
--     ),
--     'precioUnitario', producto.precio_uni,
--     'estado', (
--         select json_object(
--             'id', estado.id,
--             'nombre', estado.nombre
--         ) as estado
--         from estado
--         where estado.id = producto.estado_id
--     )
-- ) as producto from producto
-- left join bien on bien.id = producto.id
-- left join elemento_economico on elemento_economico.id = bien.id;


-- -- servicio categoria
-- select json_object(
--     'id', servicio_categoria.id,
--     'nombre', servicio_categoria.nombre
-- ) as servicioCategoria
-- from servicio_categoria;


-- -- servicio
-- select json_object(
--     'id', servicio.id,
--     'codigo', elemento_economico.codigo,
--     'nombre', servicio.nombre,
--     'magnitud', (
--         select json_object(
--             'nombre', 'uni'
--         ) as magnitud
--     ),
--     'servicioCategoria', (
--         select json_object(
--             'id', servicio_categoria.id,
--             'nombre', servicio_categoria.nombre
--         ) as servicioCategoria
--         from servicio_categoria
--         where servicio_categoria.id = servicio.servicio_categoria_id
--     ),
--     'precioUnitario', servicio.precio_uni,
--     'estado', (
--         select json_object(
--             'id', estado.id,
--             'nombre', estado.nombre
--         ) as estado
--         from estado
--         where estado.id = servicio.estado_id
--     )
-- ) as servicio from servicio
-- left join elemento_economico on elemento_economico.id = servicio.id;


-- -- pantalla marca
-- select json_object(
--     'id', pantalla_marca.id,
--     'nombre', pantalla_marca.nombre
-- ) as pantallaMarca
-- from pantalla_marca;


-- -- pantalla modelo
-- select json_object(
--     'id', pantalla_modelo.id,
--     'pantallaMarca', (
--         select json_object(
--             'id', pantalla_marca.id,
--             'nombre', pantalla_marca.nombre
--         ) as pantallaMarca
--         from pantalla_marca
--         where pantalla_marca.id = pantalla_modelo.pantalla_marca_id
--     ),
--     'nombre', pantalla_modelo.nombre
-- ) as pantallaModelo
-- from pantalla_modelo;


-- -- calidad
-- select json_object(
--     'id', calidad.id,
--     'nombre', calidad.nombre
-- ) as calidad
-- from calidad;


-- -- pantalla modelo calidad
-- select json_object(
--     'id', pantalla_modelo_calidad.id,
--     'pantallaModelo', (
--         select json_object(
--             'id', pantalla_modelo.id,
--             'pantallaMarca', (
--                 select json_object(
--                     'id', pantalla_marca.id,
--                     'nombre', pantalla_marca.nombre
--                 ) as pantallaMarca
--                 from pantalla_marca
--                 where pantalla_marca.id = pantalla_modelo.pantalla_marca_id
--             ),
--             'nombre', pantalla_modelo.nombre
--         ) as pantallaModelo
--         from pantalla_modelo
--         where pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
--     ),
--     'calidad', (
--         select json_object(
--             'id', calidad.id,
--             'nombre', calidad.nombre
--         ) as calidad
--         from calidad
--         where calidad.id = pantalla_modelo_calidad.calidad_id
--     ),
--     'precioUnitario', pantalla_modelo_calidad.precio_uni,
--     'estado', (
--         select json_object(
--             'id', estado.id,
--             'nombre', estado.nombre
--         ) as estado
--         from estado
--         where estado.id = pantalla_modelo_calidad.estado_id
--     )
-- ) as pantallaModeloCalidad
-- from pantalla_modelo_calidad;



----- DOCUMENTOS DE TRANSACCION

select json_object(
    'id', documentoTransaccion.id,
    'codigoSerie', documentoTransaccion.codigoSerie,
    'codigoNumero', documentoTransaccion.codigoNumero,
    'fechaCreacion', documentoTransaccion.fechaCreacion,
    'fechaEmision', documentoTransaccion.fechaEmision,
    'fechaArchivacion', documentoTransaccion.fechaArchivacion,
    'fechaAnulacion', documentoTransaccion.fechaAnulacion,
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
        where id = 1
    ),
    'importeBruto', documentoTransaccion.importeBruto,
    'descuento', documentoTransaccion.descuento,
    'importeNeto', documentoTransaccion.importeNeto,
    'type', documentoTransaccion.type
)
from (

    select
        nota_venta.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.f_creacion as fechaCreacion,
        documento_transaccion.f_emision as fechaEmision,
        documento_transaccion.f_archivacion as fechaArchivacion,
        documento_transaccion.f_anulacion as fechaAnulacion,
        (
            select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        ) as importeBruto,
        (
            select sum( coalesce( nota_venta_detalle.descuento, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        ) as descuento,
        (
            select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) ) - sum( coalesce( nota_venta_detalle.descuento, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        )as importeNeto,
        'NotaVenta' as type
    from nota_venta
    left join documento_transaccion on documento_transaccion.id = nota_venta.id

    union all

    select
        nota_servicio.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.f_creacion as fechaCreacion,
        documento_transaccion.f_emision as fechaEmision,
        documento_transaccion.f_archivacion as fechaArchivacion,
        documento_transaccion.f_anulacion as fechaAnulacion,
        nota_servicio.importe_bruto as importeBruto,
        nota_servicio.descuento as descuento,
        nota_servicio.importe_neto as importeNeto,
        'NotaServicio' as type
    from nota_servicio
    left join documento_transaccion on documento_transaccion.id = nota_servicio.id

    union all

    select
        entrada_credito.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.f_creacion as fechaCreacion,
        documento_transaccion.f_emision as fechaEmision,
        documento_transaccion.f_archivacion as fechaArchivacion,
        documento_transaccion.f_anulacion as fechaAnulacion,
        entrada_credito.importe_bruto as importeBruto,
        entrada_credito.descuento as descuento,
        coalesce( entrada_credito.importe_bruto, 0 ) - coalesce( entrada_credito.descuento, 0 ) as importeNeto,
        'EntradaCredito' as type
    from entrada_credito
    left join documento_transaccion on documento_transaccion.id = entrada_credito.id

    union all

    select
        comprobante_externo.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.f_creacion as fechaCreacion,
        documento_transaccion.f_emision as fechaEmision,
        documento_transaccion.f_archivacion as fechaArchivacion,
        documento_transaccion.f_anulacion as fechaAnulacion,
        (
            select sum( coalesce( comprobante_externo_detalle.cant, 0 ) * coalesce( comprobante_externo_detalle.precio_uni, 0 ) )
            from comprobante_externo_detalle
            where comprobante_externo_detalle.comprobante_externo_id = comprobante_externo.id
        ) as importeBruto,
        (
            select sum( coalesce( comprobante_externo_detalle.descuento, 0 ) )
            from comprobante_externo_detalle
            where comprobante_externo_detalle.comprobante_externo_id = comprobante_externo.id
        ) as descuento,
        (
            select sum( coalesce( comprobante_externo_detalle.cant, 0 ) * coalesce( comprobante_externo_detalle.precio_uni, 0 ) ) - sum( coalesce( comprobante_externo_detalle.descuento, 0 ) )
            from comprobante_externo_detalle
            where comprobante_externo_detalle.comprobante_externo_id = comprobante_externo.id
        ) as importeNeto,
        'ComprobanteExterno' as type
    from comprobante_externo
    left join documento_transaccion on documento_transaccion.id = comprobante_externo.id

    union all

    select
        salida_credito.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.f_creacion as fechaCreacion,
        documento_transaccion.f_emision as fechaEmision,
        documento_transaccion.f_anulacion as fechaAnulacion,
        documento_transaccion.f_archivacion as fechaArchivacion,
        salida_credito.importe_bruto as importeBruto,
        salida_credito.descuento as descuento,
        coalesce( salida_credito.importe_bruto, 0 ) - coalesce( salida_credito.descuento, 0 ) as importeNeto,
        'SalidaCredito' as type
    from salida_credito
    left join documento_transaccion on documento_transaccion.id = salida_credito.id

) as documentoTransaccion;


-- NOTA DE VENTA RESUMEN

select json_object(
    'id', nota_venta.id,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'establecimiento', (
        select json_object(
            'id', establecimiento.id,
            'ruc', establecimiento.ruc,
            'razonSocial', establecimiento.razon_social,
            'rubro', establecimiento.rubro,
            'domicilio', establecimiento.domicilio,
            'celular', establecimiento.celular
        ) as establecimiento
        from establecimiento
        where establecimiento.id = documento_transaccion.establecimiento_id
    ),
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaArchivacion', documento_transaccion.f_archivacion,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'usuario', (
        select json_object(
            'id', usuario.id,
            'documentoIdentificacion',(
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = usuario.documento_identificacion_id
            ),
            'codigo', usuario.cod,
            'nombre', usuario.nombre,
            'apellido', usuario.apellido,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'estado', (
                select json_object(
                    'id', estado.id,
                    'nombre', estado.nombre
                ) as estado
                from estado
                where estado.id = usuario.estado_id
            )
        ) as usuario
        from usuario
        where usuario.id = nota_venta.usuario_id
    ),
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
    'importeBruto', (
        select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) )
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    'descuento', (
        select sum( coalesce( nota_venta_detalle.descuento, 0 ) )
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    'importeNeto', (
        select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) ) - sum( coalesce( nota_venta_detalle.descuento, 0 ) )
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    'liquidacionTipo', (
        select json_object(
            'id', liquidacion_tipo.id,
            'nombre', liquidacion_tipo.nombre
        ) as liquidacionTipo
        from liquidacion_tipo
        where liquidacion_tipo.id = nota_venta.liquidacion_tipo_id
    )
) as notaVenta
from nota_venta
left join documento_transaccion on documento_transaccion.id = nota_venta.id
left join establecimiento on establecimiento.id = documento_transaccion.establecimiento_id
left join liquidacion_tipo on liquidacion_tipo.id = nota_venta.liquidacion_tipo_id;


-- NOTA VENTA
select json_object(
    'id', nota_venta.id,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'establecimiento', (
        select json_object(
            'id', establecimiento.id,
            'ruc', establecimiento.ruc,
            'razonSocial', establecimiento.razon_social,
            'rubro', establecimiento.rubro,
            'domicilio', establecimiento.domicilio,
            'celular', establecimiento.celular
        ) as establecimiento
        from establecimiento
        where establecimiento.id = documento_transaccion.establecimiento_id
    ),
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaArchivacion', documento_transaccion.f_archivacion,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'usuario', (
        select json_object(
            'id', usuario.id,
            'documentoIdentificacion',(
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = usuario.documento_identificacion_id
            ),
            'codigo', usuario.cod,
            'nombre', usuario.nombre,
            'apellido', usuario.apellido,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'estado', (
                select json_object(
                    'id', estado.id,
                    'nombre', estado.nombre
                ) as estado
                from estado
                where estado.id = usuario.estado_id
            )
        ) as usuario
        from usuario
        where usuario.id = nota_venta.usuario_id
    ),
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
    'detalles', (
        select json_arrayagg( json_object(
            'id', nota_venta_detalle.id,
            'notaVenta', json_object( 'id', nota_venta.id ),
            'elementoEconomico', (

                select json_object(
                    'id', cte_elemento_economico.id,
                    'codigo', cte_elemento_economico.codigo,
                    'nombre', cte_elemento_economico.nombre,
                    'magnitud', cte_elemento_economico.magnitudNombre,
                    'categoria', cte_elemento_economico.categoria,
                    'precioUnitario', cte_elemento_economico.precioUnitario,
                    'estado', (
                        select json_object(
                            'id', estado.id,
                            'nombre', estado.nombre
                        ) as estado
                        from estado
                        where estado.id = cte_elemento_economico.estadoId
                    ),
                    'type', cte_elemento_economico.type
                )
                from (

                    select
                        pantalla_modelo_calidad.id as id,
                        elemento_economico.codigo as codigo,
                        concat(
                            pantalla_marca.nombre, ' ',
                            pantalla_modelo.nombre, ' ',
                            calidad.nombre
                        ) as nombre,
                        'uni' as magnitudNombre,
                        'pantalla celular' as categoria,
                        pantalla_modelo_calidad.precio_uni as precioUnitario,
                        pantalla_modelo_calidad.estado_id as estadoId,
                        'PantallaModeloCalidad' as type
                    from pantalla_modelo_calidad
                    left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id
                    left join pantalla_modelo on pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
                    left join pantalla_marca on pantalla_marca.id = pantalla_modelo.pantalla_marca_id
                    left join calidad on calidad.id = pantalla_modelo_calidad.calidad_id

                    union all
                    
                    select
                        producto.id as id,
                        elemento_economico.codigo as codigo,
                        concat(
                            bien_marca.nombre, ' ',
                            bien.nombre
                        ) as nombre,
                        magnitud.nombre as magnitudNombre,
                        bien_categoria.nombre as categoria,
                        producto.precio_uni as precioUnitario,
                        producto.estado_id as estadoId,
                        'Producto' as type
                    from producto
                    left join bien on bien.id = producto.id
                    left join elemento_economico on elemento_economico.id = bien.id
                    left join bien_marca on bien_marca.id = bien.bien_marca_id
                    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
                    left join magnitud on magnitud.id = bien.magnitud_id
                    
                    union all
                    
                    select
                        bien_capital.id as id,
                        elemento_economico.codigo as codigo,
                        concat(
                            bien_marca.nombre, ' ',
                            bien.nombre, ' ',
                            magnitud.nombre
                        ) as nombre,
                        magnitud.nombre as magnitudNombre,
                        bien_categoria.nombre as categoria,
                        bien_capital.valor_residual as precioUnitario,
                        bien_capital.estado_id as estadoId,
                        'BienCapital' as type
                    from bien_capital
                    left join bien on bien.id = bien_capital.id
                    left join elemento_economico on elemento_economico.id = bien.id
                    left join bien_marca on bien_marca.id = bien.bien_marca_id
                    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
                    left join magnitud on magnitud.id = bien.magnitud_id
                    
                    union all
                    
                    select
                        servicio.id as id,
                        elemento_economico.codigo as codigo,
                        servicio.nombre as nombre,
                        'uni' as magnitudNombre,
                        servicio_categoria.nombre as categoria,
                        servicio.precio_uni as precioUnitario,
                        servicio.estado_id as estadoId,
                        'Servicio' as type
                    from servicio
                    left join elemento_economico on elemento_economico.id = servicio.id
                    left join servicio_categoria on servicio_categoria.id = servicio.servicio_categoria_id

                ) as cte_elemento_economico
                where cte_elemento_economico.id = nota_venta_detalle.elemento_economico_id
            ),
            'concepto', nota_venta_detalle.concepto,
            'cantidad', nota_venta_detalle.cant,
            'precioUnitario', nota_venta_detalle.precio_uni,
            'descuento', nota_venta_detalle.descuento,
            'comentario', nota_venta_detalle.comentario
        ) )
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    
    'importeBruto', (
        select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) )
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    'descuento', (
        select sum( coalesce( nota_venta_detalle.descuento, 0 ) )
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    'importeNeto', (
        select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) ) - sum( coalesce( nota_venta_detalle.descuento, 0 ) )
        from nota_venta_detalle
        where nota_venta_detalle.nota_venta_id = nota_venta.id
    ),
    'liquidacionTipo', (
        select json_object(
            'id', liquidacion_tipo.id,
            'nombre', liquidacion_tipo.nombre
        ) as liquidacionTipo
        from liquidacion_tipo
        where liquidacion_tipo.id = nota_venta.liquidacion_tipo_id
    ),
    'credito', (
        select json_object(
            'id', nota_venta_credito.id,
            'concepto', concat( documento_transaccion.cod_serie, '-', documento_transaccion.cod_numero ),
            'tasaInteresDiario', nota_venta_credito.tasa_interes_diario,
            'importeBruto', nota_venta_credito.importe_bruto,
            'descuento', nota_venta_credito.descuento,
            'cuotas', (
                select json_arrayagg( json_object(
                    'id', nota_venta_cuota.id,
                    'numero', nota_venta_cuota.numero,
                    'fechaInicio', nota_venta_cuota.f_inicio,
                    'fechaVencimiento', nota_venta_cuota.f_vencimiento,
                    'cuota', nota_venta_cuota.cuota,
                    'amortizacion', nota_venta_cuota.amortizacion,
                    'interes', nota_venta_cuota.interes,
                    'saldo', nota_venta_cuota.saldo,
                    'cobros', (
                        select json_arrayagg( json_object(
                            'id', nota_venta_cobro.id,
                            'codigo', documento_movimiento.codigo,
                            'fechaCreacion', documento_movimiento.f_creacion,
                            'fechaEmision', documento_movimiento.f_emision,
                            'fechaAnulacion', documento_movimiento.f_anulacion,
                            'concepto', entrada_efectivo.concepto,
                            'efectivo', entrada_efectivo.efectivo
                        ) )
                        from nota_venta_cobro
                        left join entrada_efectivo on entrada_efectivo.id = nota_venta_cobro.id
                        left join documento_movimiento on documento_movimiento.id = entrada_efectivo.id
                        where nota_venta_cobro.nota_venta_cuota_id = nota_venta_cuota.id
                    )
                ) )
                from nota_venta_cuota
                where nota_venta_cuota.nota_venta_credito_id = nota_venta_credito.id
            )
        )
        from nota_venta_credito
        where nota_venta_credito.nota_venta_id = nota_venta.id
    )
) as notaVenta
from nota_venta
left join documento_transaccion on documento_transaccion.id = nota_venta.id
left join establecimiento on establecimiento.id = documento_transaccion.establecimiento_id
left join liquidacion_tipo on liquidacion_tipo.id = nota_venta.liquidacion_tipo_id;

--- codigo numero
select documento_transaccion.cod_numero as codigoNumero
from nota_venta
left join documento_transaccion on documento_transaccion.id = nota_venta.id
where cod_serie = 'SERIE01'
order by cod_numero desc
limit 1;



-- NOTA SERVICIO RESUMEN
select json_object(
    'id', nota_servicio.id,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'establecimiento', (
        select json_object(
            'id', establecimiento.id,
            'ruc', establecimiento.ruc,
            'razonSocial', establecimiento.razon_social,
            'rubro', establecimiento.rubro,
            'domicilio', establecimiento.domicilio,
            'celular', establecimiento.celular
        ) as establecimiento
        from establecimiento
        where establecimiento.id = documento_transaccion.establecimiento_id
    ),
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaArchivacion', documento_transaccion.f_archivacion,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'usuario', (
        select json_object(
            'id', usuario.id,
            'documentoIdentificacion',(
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = usuario.documento_identificacion_id
            ),
            'codigo', usuario.cod,
            'nombre', usuario.nombre,
            'apellido', usuario.apellido,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'estado', (
                select json_object(
                    'id', estado.id,
                    'nombre', estado.nombre
                ) as estado
                from estado
                where estado.id = usuario.estado_id
            )
        )
        from usuario
        where usuario.id = nota_servicio.usuario_id
    ),
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
        )
        from cliente
        where cliente.id = nota_servicio.cliente_id
    ),
    'receptorDocumentoIdentificacion', (
        select json_object(
            'id', documento_identificacion.id,
            'nombre', documento_identificacion.nombre
        ) as documentoIdentificacion
        from documento_identificacion
        where documento_identificacion.id = nota_servicio.receptor_documento_identificacion_id
    ),
    'receptorCodigo', nota_servicio.receptor_cod,
    'receptorNombre', nota_servicio.receptor_nombre,
    'receptorCelular', nota_servicio.receptor_celular,
    'pantallaModelo', (
        select json_object(
            'id', pantalla_modelo.id,
            'nombre', pantalla_modelo.nombre,
            'marca', (
                select json_object(
                    'id', pantalla_marca.id,
                    'nombre', pantalla_marca.nombre
                )
                from pantalla_marca
                where pantalla_marca.id = pantalla_modelo.pantalla_marca_id
            )
        )
        from pantalla_modelo
        where pantalla_modelo.id = nota_servicio.pantalla_modelo_id
    ),
    'imei', nota_servicio.imei,
    'importeBruto', nota_servicio.importe_bruto,
    'descuento', nota_servicio.descuento,
    'importeNeto', nota_servicio.importe_neto,
    'liquidacionTipo', (
        select json_object(
            'id', liquidacion_tipo.id,
            'nombre', liquidacion_tipo.nombre
        ) as liquidacionTipo
        from liquidacion_tipo
        where liquidacion_tipo.id = nota_servicio.liquidacion_tipo_id
    )
) AS notaServicio
from nota_servicio
left join documento_transaccion on documento_transaccion.id = nota_servicio.id;


-- NOTA SERVICIO
select json_object(
    'id', nota_servicio.id,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'establecimiento', (
        select json_object(
            'id', establecimiento.id,
            'ruc', establecimiento.ruc,
            'razonSocial', establecimiento.razon_social,
            'rubro', establecimiento.rubro,
            'domicilio', establecimiento.domicilio,
            'celular', establecimiento.celular
        ) as establecimiento
        from establecimiento
        where establecimiento.id = documento_transaccion.establecimiento_id
    ),
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaArchivacion', documento_transaccion.f_archivacion,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'usuario', (
        select json_object(
            'id', usuario.id,
            'documentoIdentificacion',(
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = usuario.documento_identificacion_id
            ),
            'codigo', usuario.cod,
            'nombre', usuario.nombre,
            'apellido', usuario.apellido,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'estado', (
                select json_object(
                    'id', estado.id,
                    'nombre', estado.nombre
                ) as estado
                from estado
                where estado.id = usuario.estado_id
            )
        )
        from usuario
        where usuario.id = nota_servicio.usuario_id
    ),
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
        )
        from cliente
        where cliente.id = nota_servicio.cliente_id
    ),
    'receptorDocumentoIdentificacion', (
        select json_object(
            'id', documento_identificacion.id,
            'nombre', documento_identificacion.nombre
        ) as documentoIdentificacion
        from documento_identificacion
        where documento_identificacion.id = nota_servicio.receptor_documento_identificacion_id
    ),
    'receptorCodigo', nota_servicio.receptor_cod,
    'receptorNombre', nota_servicio.receptor_nombre,
    'receptorCelular', nota_servicio.receptor_celular,
    'pantallaModelo', (
        select json_object(
            'id', pantalla_modelo.id,
            'nombre', pantalla_modelo.nombre,
            'marca', (
                select json_object(
                    'id', pantalla_marca.id,
                    'nombre', pantalla_marca.nombre
                )
                from pantalla_marca
                where pantalla_marca.id = pantalla_modelo.pantalla_marca_id
            )
        )
        from pantalla_modelo
        where pantalla_modelo.id = nota_servicio.pantalla_modelo_id
    ),
    'imei', nota_servicio.imei,
    'reparacion', nota_servicio.reparacion,
    'importeBruto', nota_servicio.importe_bruto,
    'descuento', nota_servicio.descuento,
    'importeNeto', nota_servicio.importe_neto,
    'liquidacionTipo', (
        select json_object(
            'id', liquidacion_tipo.id,
            'nombre', liquidacion_tipo.nombre
        ) as liquidacionTipo
        from liquidacion_tipo
        where liquidacion_tipo.id = nota_servicio.liquidacion_tipo_id
    ),
    'accesorios', (
        select json_arrayagg( json_object(
            'id', nota_servicio_accesorio.id,
            'nombre', nota_servicio_accesorio.nombre
        ) )
        from nota_servicio_accesorio
        where nota_servicio_accesorio.nota_servicio_id = nota_servicio.id
    ),
    'observaciones', (
        select json_arrayagg( json_object(
            'id', nota_servicio_observacion.id,
            'nombre', nota_servicio_observacion.nombre
        ) )
        from nota_servicio_observacion
        where nota_servicio_observacion.nota_servicio_id = nota_servicio.id
    ),
    'credito', (
        select json_object(
            'id', nota_servicio_credito.id,
            'concepto', concat( documento_transaccion.cod_serie, '-', documento_transaccion.cod_numero ),
            'tasaInteresDiario', nota_servicio_credito.tasa_interes_diario,
            'importeBruto', nota_servicio_credito.importe_bruto,
            'descuento', nota_servicio_credito.descuento,
            'cuotas', (
                select json_arrayagg( json_object(
                    'id', nota_servicio_cuota.id,
                    'numero', nota_servicio_cuota.numero,
                    'fechaInicio', nota_servicio_cuota.f_inicio,
                    'fechaVencimiento', nota_servicio_cuota.f_vencimiento,
                    'cuota', nota_servicio_cuota.cuota,
                    'amortizacion', nota_servicio_cuota.amortizacion,
                    'interes', nota_servicio_cuota.interes,
                    'saldo', nota_servicio_cuota.saldo,
                    'cobros', (
                        select json_arrayagg( json_object(
                            'id', nota_servicio_cobro.id,
                            'codigo', documento_movimiento.codigo,
                            'fechaCreacion', documento_movimiento.f_creacion,
                            'fechaEmision', documento_movimiento.f_emision,
                            'fechaAnulacion', documento_movimiento.f_anulacion,
                            'concepto', entrada_efectivo.concepto,
                            'efectivo', entrada_efectivo.efectivo
                        ) )
                        from nota_servicio_cobro
                        left join entrada_efectivo on entrada_efectivo.id = nota_servicio_cobro.id
                        left join documento_movimiento on documento_movimiento.id = entrada_efectivo.id
                        where nota_servicio_cobro.nota_servicio_cuota_id = nota_servicio_cuota.id
                    )
                ) )
                from nota_servicio_cuota
                where nota_servicio_cuota.nota_servicio_credito_id = nota_servicio_credito.id
            )
        )
        from nota_servicio_credito
        where nota_servicio_credito.nota_servicio_id = nota_servicio.id
    )
) AS notaServicio
from nota_servicio
left join documento_transaccion on documento_transaccion.id = nota_servicio.id;


-- ENTRADA CREDITO RESUMEN
select json_object(
    'id', entrada_credito.id,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'establecimiento', (
        select json_object(
            'id', establecimiento.id,
            'ruc', establecimiento.ruc,
            'razonSocial', establecimiento.razon_social,
            'rubro', establecimiento.rubro,
            'domicilio', establecimiento.domicilio,
            'celular', establecimiento.celular
        ) as establecimiento
        from establecimiento
        where establecimiento.id = documento_transaccion.establecimiento_id
    ),
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaArchivacion', documento_transaccion.f_archivacion,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'usuario', (
        select json_object(
            'id', usuario.id,
            'documentoIdentificacion',(
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = usuario.documento_identificacion_id
            ),
            'codigo', usuario.cod,
            'nombre', usuario.nombre,
            'apellido', usuario.apellido,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'estado', (
                select json_object(
                    'id', estado.id,
                    'nombre', estado.nombre
                ) as estado
                from estado
                where estado.id = usuario.estado_id
            )
        )
        from usuario
        where usuario.id = entrada_credito.usuario_id
    ),
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
        )
        from cliente
        where cliente.id = entrada_credito.cliente_id
    ),
    'receptorDocumentoIdentificacion', (
        select json_object(
            'id', documento_identificacion.id,
            'nombre', documento_identificacion.nombre
        ) as documentoIdentificacion
        from documento_identificacion
        where documento_identificacion.id = entrada_credito.receptor_documento_identificacion_id
    ),
    'receptorCodigo', entrada_credito.receptor_cod,
    'receptorNombre', entrada_credito.receptor_nombre,
    'receptorCelular', entrada_credito.receptor_celular,
    'tasaInteresDiario', entrada_credito.tasa_interes_diario,
    'importeBruto', entrada_credito.importe_bruto,
    'descuento', entrada_credito.descuento,
    'importeNeto', ( coalesce( entrada_credito.importe_bruto, 0 ) - coalesce( entrada_credito.descuento, 0 ) )
) as entradaCredito
from entrada_credito
left join documento_transaccion on documento_transaccion.id = entrada_credito.id;

-- ENTRADA CREDITO
select json_object(
    'id', entrada_credito.id,
    'codigoSerie', documento_transaccion.cod_serie,
    'codigoNumero', documento_transaccion.cod_numero,
    'establecimiento', (
        select json_object(
            'id', establecimiento.id,
            'ruc', establecimiento.ruc,
            'razonSocial', establecimiento.razon_social,
            'rubro', establecimiento.rubro,
            'domicilio', establecimiento.domicilio,
            'celular', establecimiento.celular
        ) as establecimiento
        from establecimiento
        where establecimiento.id = documento_transaccion.establecimiento_id
    ),
    'fechaCreacion', documento_transaccion.f_creacion,
    'fechaEmision', documento_transaccion.f_emision,
    'fechaArchivacion', documento_transaccion.f_archivacion,
    'fechaAnulacion', documento_transaccion.f_anulacion,
    'usuario', (
        select json_object(
            'id', usuario.id,
            'documentoIdentificacion',(
                select json_object(
                    'id', documento_identificacion.id,
                    'nombre', documento_identificacion.nombre
                ) as documentoIdentificacion
                from documento_identificacion
                where documento_identificacion.id = usuario.documento_identificacion_id
            ),
            'codigo', usuario.cod,
            'nombre', usuario.nombre,
            'apellido', usuario.apellido,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'estado', (
                select json_object(
                    'id', estado.id,
                    'nombre', estado.nombre
                ) as estado
                from estado
                where estado.id = usuario.estado_id
            )
        )
        from usuario
        where usuario.id = entrada_credito.usuario_id
    ),
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
        )
        from cliente
        where cliente.id = entrada_credito.cliente_id
    ),
    'receptorDocumentoIdentificacion', (
        select json_object(
            'id', documento_identificacion.id,
            'nombre', documento_identificacion.nombre
        ) as documentoIdentificacion
        from documento_identificacion
        where documento_identificacion.id = entrada_credito.receptor_documento_identificacion_id
    ),
    'receptorCodigo', entrada_credito.receptor_cod,
    'receptorNombre', entrada_credito.receptor_nombre,
    'receptorCelular', entrada_credito.receptor_celular,
    'concepto', entrada_credito.concepto,
    'tasaInteresDiario', entrada_credito.tasa_interes_diario,
    'importeBruto', entrada_credito.importe_bruto,
    'descuento', entrada_credito.descuento,
    'importeNeto', ( coalesce( entrada_credito.importe_bruto, 0 ) - coalesce( entrada_credito.descuento, 0 ) ),
    'cuotas', (
        select json_arrayagg( json_object(
            'id', entrada_cuota.id,
            'numero', entrada_cuota.numero,
            'fechaInicio', entrada_cuota.f_inicio,
            'fechaVencimiento', entrada_cuota.f_vencimiento,
            'cuota', entrada_cuota.cuota,
            'amortizacion', entrada_cuota.amortizacion,
            'interes', entrada_cuota.interes,
            'saldo', entrada_cuota.saldo,
            'cobros', (
                select json_arrayagg( json_object(
                    'id', cobro.id,
                    'codigo', documento_movimiento.codigo,
                    'fechaCreacion', documento_movimiento.f_creacion,
                    'fechaEmision', documento_movimiento.f_emision,
                    'fechaAnulacion', documento_movimiento.f_anulacion,
                    'concepto', entrada_efectivo.concepto,
                    'efectivo', entrada_efectivo.efectivo
                ) )
                from cobro
                left join entrada_efectivo on entrada_efectivo.id = cobro.id
                left join documento_movimiento on documento_movimiento.id = entrada_efectivo.id
                where cobro.entrada_cuota_id = entrada_cuota.id
            )
        ) )
        from entrada_cuota
        where entrada_cuota.entrada_credito_id = entrada_credito.id
    )
) as entradaCredito
from entrada_credito
left join documento_transaccion on documento_transaccion.id = entrada_credito.id;


--LIMITE

----- DOCUMENTOS DE MOVIMIENTOS

-- ENTRADA EFECTIVO CONTADO ANEXO
select json_object(
    'id', entrada_efectivo_contado.id,
    'codigo', documento_movimiento_economico.codigo,
    'fechaCreacion', entrada_efectivo_contado.f_creacion,
    'fechaEmision', entrada_efectivo_contado.f_emision,
    'fechaAnulacion', entrada_efectivo_contado.f_anulacion,
    'concepto', entrada_efectivo_contado.concepto,
    'efectivo', entrada_efectivo_contado.efectivo
) as entradaEfectivoContado
from entrada_efectivo_contado
left join documento_movimiento_economico on documento_movimiento_economico.id = entrada_efectivo_contado.id;

with cte_documento_mercantil as (

    select
        nota_venta.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.establecimiento_id as establecimiento_id,
        nota_venta.f_creacion as fechaCreacion,
        nota_venta.f_emision as fechaEmision,
        nota_venta.f_anulacion as fechaAnulacion,
        (
            select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        ) as importeBruto,
        (
            select sum( coalesce( nota_venta_detalle.descuento, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        ) as descuento,
        (
            select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) ) - sum( coalesce( nota_venta_detalle.descuento, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        )as importeNeto
    from nota_venta
    left join documento_transaccion on documento_transaccion.id = nota_venta.id

    union all

    select
        nota_servicio.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.establecimiento_id as establecimiento_id,
        nota_servicio.f_creacion as fechaCreacion,
        nota_servicio.f_emision as fechaEmision,
        nota_servicio.f_anulacion as fechaAnulacion,
        0 as importeBruto,
        0 as descuento,
        0 as importeNeto
    from nota_servicio
    left join documento_transaccion on documento_transaccion.id = nota_servicio.id

)
select json_object(
    'id', entrada_efectivo_contado.id,
    'codigo', documento_movimiento_economico.codigo,
    'fechaCreacion', entrada_efectivo_contado.f_creacion,
    'fechaEmision', entrada_efectivo_contado.f_emision,
    'fechaAnulacion', entrada_efectivo_contado.f_anulacion,
    'concepto', entrada_efectivo_contado.concepto,
    'efectivo', entrada_efectivo_contado.efectivo,
    'documentoTransaccion', (
        select json_object(
            'id', cte_documento_mercantil.id,
            'codigoSerie', cte_documento_mercantil.codigoSerie,
            'codigoNumero', cte_documento_mercantil.codigoNumero,
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
                where establecimiento.id = cte_documento_mercantil.establecimiento_id
            ),
            'fechaCreacion', cte_documento_mercantil.fechaCreacion,
            'fechaEmision', cte_documento_mercantil.fechaEmision,
            'fechaAnulacion', cte_documento_mercantil.fechaAnulacion,
            'importeBruto', cte_documento_mercantil.importeBruto,
            'descuento', cte_documento_mercantil.descuento,
            'importeNeto', cte_documento_mercantil.importeNeto
        )
        from cte_documento_mercantil
        where cte_documento_mercantil.id = documento_movimiento_economico.documento_mercantil_id
    )
) as entradaEfectivoContado
from entrada_efectivo_contado
left join documento_movimiento_economico on documento_movimiento_economico.id = entrada_efectivo_contado.id
left join cte_documento_mercantil on cte_documento_mercantil.id = documento_movimiento_economico.documento_mercantil_id
where cte_documento_mercantil.id = 3;
--where entrada_efectivo_contado.id = 1;

use servicio_tecnico;
select * from documento_transaccion;
select * from nota_venta;
select * from nota_servicio;
insert into nota_servicio( null );


-- ENTRADA EFECTIVO CREDITO ANEXO
select json_object(
    'id', entrada_efectivo_credito.id,
    'codigo', documento_movimiento_economico.codigo,
    'fechaCreacion', entrada_efectivo_credito.f_creacion,
    'fechaEmision', entrada_efectivo_credito.f_emision,
    'fechaArchivacion', entrada_efectivo_credito.f_archivacion,
    'fechaAnulacion', entrada_efectivo_credito.f_anulacion,
    'concepto', entrada_efectivo_credito.concepto,
    'efectivo', entrada_efectivo_credito.efectivo,
    'tasaInteresDiario', entrada_efectivo_credito.tasa_interes_diario,
    'cuotas', (
        select json_arrayagg( json_object(
            'id', entrada_cuota.id,
            'fechaVencimiento', entrada_cuota.f_vencimiento,
            'amortizacion', entrada_cuota.amortizacion,
            'interes', entrada_cuota.interes,
            'cuota', entrada_cuota.cuota,
            'mora', entrada_cuota.mora,
            'cobros', (
                select json_arrayagg( json_object(
                    'id', cobro.id,
                    'fecha', cobro.fecha,
                    'monto', cobro.monto
                ) )
                from cobro
                where cobro.entrada_cuota_id = entrada_cuota.id
            )
        ) )
        from entrada_cuota
        where entrada_cuota.entrada_efectivo_credito_id = entrada_efectivo_credito.id
    )
) as entradaEfectivoCredito
from entrada_efectivo_credito
left join documento_movimiento_economico on documento_movimiento_economico.id = entrada_efectivo_credito.id;

with cte_documento_mercantil as (

    select
        nota_venta.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.establecimiento_id as establecimiento_id,
        nota_venta.f_creacion as fechaCreacion,
        nota_venta.f_emision as fechaEmision,
        nota_venta.f_anulacion as fechaAnulacion,
        (
            select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        ) as importeBruto,
        (
            select sum( coalesce( nota_venta_detalle.descuento, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        ) as descuento,
        (
            select sum( coalesce( nota_venta_detalle.cant, 0 ) * coalesce( nota_venta_detalle.precio_uni, 0 ) ) - sum( coalesce( nota_venta_detalle.descuento, 0 ) )
            from nota_venta_detalle
            where nota_venta_detalle.nota_venta_id = nota_venta.id
        )as importeNeto
    from nota_venta
    left join documento_transaccion on documento_transaccion.id = nota_venta.id

    union all

    select
        nota_servicio.id as id,
        documento_transaccion.cod_serie as codigoSerie,
        documento_transaccion.cod_numero as codigoNumero,
        documento_transaccion.establecimiento_id as establecimiento_id,
        nota_servicio.f_creacion as fechaCreacion,
        nota_servicio.f_emision as fechaEmision,
        nota_servicio.f_anulacion as fechaAnulacion,
        0 as importeBruto,
        0 as descuento,
        0 as importeNeto
    from nota_servicio
    left join documento_transaccion on documento_transaccion.id = nota_servicio.id

)
select json_object(
    'id', entrada_efectivo_credito.id,
    'codigo', documento_movimiento_economico.codigo,
    'fechaCreacion', entrada_efectivo_credito.f_creacion,
    'fechaEmision', entrada_efectivo_credito.f_emision,
    'fechaArchivacion', entrada_efectivo_credito.f_archivacion,
    'fechaAnulacion', entrada_efectivo_credito.f_anulacion,
    'concepto', entrada_efectivo_credito.concepto,
    'efectivo', entrada_efectivo_credito.efectivo,
    'tasaInteresDiario', entrada_efectivo_credito.tasa_interes_diario,
    'cuotas', (
        select json_arrayagg( json_object(
            'id', entrada_cuota.id,
            'fechaVencimiento', entrada_cuota.f_vencimiento,
            'amortizacion', entrada_cuota.amortizacion,
            'interes', entrada_cuota.interes,
            'cuota', entrada_cuota.cuota,
            'mora', entrada_cuota.mora,
            'cobros', (
                select json_arrayagg( json_object(
                    'id', cobro.id,
                    'fecha', cobro.fecha,
                    'monto', cobro.monto
                ) )
                from cobro
                where cobro.entrada_cuota_id = entrada_cuota.id
            )
        ) )
        from entrada_cuota
        where entrada_cuota.entrada_efectivo_credito_id = entrada_efectivo_credito.id
    ),
    'documentoTransaccion', (
        select json_object(
            'id', cte_documento_mercantil.id,
            'codigoSerie', cte_documento_mercantil.codigoSerie,
            'codigoNumero', cte_documento_mercantil.codigoNumero,
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
                where establecimiento.id = cte_documento_mercantil.establecimiento_id
            ),
            'fechaCreacion', cte_documento_mercantil.fechaCreacion,
            'fechaEmision', cte_documento_mercantil.fechaEmision,
            'fechaAnulacion', cte_documento_mercantil.fechaAnulacion,
            'importeBruto', cte_documento_mercantil.importeBruto,
            'descuento', cte_documento_mercantil.descuento,
            'importeNeto', cte_documento_mercantil.importeNeto
        )
        from cte_documento_mercantil
        where cte_documento_mercantil.id = documento_movimiento_economico.documento_mercantil_id
    )
) as entradaEfectivoCredito
from entrada_efectivo_credito
left join documento_movimiento_economico on documento_movimiento_economico.id = entrada_efectivo_credito.id
left join cte_documento_mercantil on cte_documento_mercantil.id = documento_movimiento_economico.documento_mercantil_id
where cte_documento_mercantil.id = 4;
--where entrada_efectivo_credito.id = 4;



-- DOCUMENTO FLUJO EFECTIVO
with cte_comprobante_ingreso as (

    select
        nota_venta.id as id,
        nota_venta.f_creacion as fechaCreacion,
        nota_venta.f_emision as fechaEmision,
        nota_venta.f_anulacion as fechaAnulacion
    from nota_venta
    left join comprobante_ingreso on comprobante_ingreso.id = nota_venta.id
    left join documento_transaccion on documento_transaccion.id = comprobante_ingreso.id

    union all

    select
        nota_servicio.id as id,
        nota_servicio.f_creacion as fechaCreacion,
        nota_servicio.f_emision as fechaEmision,
        nota_servicio.f_anulacion as fechaAnulacion
    from nota_servicio
    left join comprobante_ingreso on comprobante_ingreso.id = nota_servicio.id
    left join documento_transaccion on documento_transaccion.id = comprobante_ingreso.id
),
cte_documento_entrada_efectivo as (

    select
        entrada_efectivo_contado.id as id,
        cte_comprobante_ingreso.fechaCreacion as fechaCreacion,
        cte_comprobante_ingreso.fechaEmision as fechaEmision,
        cte_comprobante_ingreso.fechaAnulacion as fechaAnulacion,
        entrada_efectivo_contado.concepto as concepto,
        entrada_efectivo_contado.efectivo as efectivo
    from entrada_efectivo_contado
    left join entrada_comprobante_ingreso on entrada_comprobante_ingreso.id = entrada_efectivo_contado.id
    left join documento_movimiento_economico on documento_movimiento_economico.id = entrada_comprobante_ingreso.id
    left join cte_comprobante_ingreso on cte_comprobante_ingreso.id = entrada_comprobante_ingreso.comprobante_ingreso_id

    union all

    select
        entrada_efectivo.id as id,
        entrada_efectivo.f_creacion as fechaCreacion,
        entrada_efectivo.f_emision as fechaEmision,
        entrada_efectivo.f_anulacion as fechaAnulacion,
        entrada_efectivo.concepto as concepto,
        entrada_efectivo.efectivo as efectivo
    from entrada_efectivo
    left join entrada_comprobante_egreso on entrada_comprobante_egreso.id = entrada_efectivo.id

)
select * from cte_documento_entrada_efectivo;