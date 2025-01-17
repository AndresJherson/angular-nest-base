use servicio_tecnico;

-- medio transaferencia
select json_object(
    'id', medio_transferencia.id,
    'nombre', medio_transferencia.nombre
)
from medio_transferencia;
 


-- MOVIMIENTO EFECTIVO
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
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'importeNeto', movimiento_efectivo.efectivo,
    'medioTransferencia', null,
    'documentoTransaccion', null,
    'type', movimiento_efectivo.type
) as data
from movimiento_efectivo
left join documento_movimiento on documento_movimiento.id = movimiento_efectivo.id
left join medio_transferencia on medio_transferencia.id = movimiento_efectivo.medioTransferenciaId;



-- ENTRADA EFECTIVO
select json_object(
    'id', documento_movimiento.id,
    'uuid', documento_movimiento.uuid,
    'codigo', documento_movimiento.codigo,
    'fechaEmision', documento_movimiento.f_emision,
    'fechaAnulacion', documento_movimiento.f_anulacion,
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'importeNeto', entrada_efectivo.efectivo,
    'medioTransferencia', null,
    'documentoTransaccion', null
) as data
from entrada_efectivo
left join documento_movimiento on documento_movimiento.id = entrada_efectivo.id;



-- SALIDA EFECTIVO
select json_object(
    'id', documento_movimiento.id,
    'uuid', documento_movimiento.uuid,
    'codigo', documento_movimiento.codigo,
    'fechaEmision', documento_movimiento.f_emision,
    'fechaAnulacion', documento_movimiento.f_anulacion,
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'importeNeto', salida_efectivo.efectivo,
    'medioTransferencia', null,
    'documentoTransaccion', null
) as data
from salida_efectivo
left join documento_movimiento on documento_movimiento.id = salida_efectivo.id;



-- MOVIMIENTO PANTALLAS
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
    'usuario', null,
    'concepto', movimiento_pantalla.concepto,
    'documentoTransaccion', null,
    'detalles', (
        select json_arrayagg( json_object(
            'id', movimiento_pantalla_detalle.id,
            'pantallaModeloCalidad', null,
            'cantidad', movimiento_pantalla_detalle.cantidad,
            'importeUnitario', movimiento_pantalla_detalle.importeUnitario,
            'type', movimiento_pantalla_detalle.type
        ) )
        from movimiento_pantalla_detalle
        where movimiento_pantalla_detalle.movimientoPantallaId = movimiento_pantalla.id
    ),
    'type', movimiento_pantalla.type
) as data
from movimiento_pantalla;



-- ENTRADA PANTALLAS
select json_object(
    'id', documento_movimiento.id,
    'uuid', documento_movimiento.uuid,
    'codigo', documento_movimiento.codigo,
    'fechaEmision', documento_movimiento.f_emision,
    'fechaAnulacion', documento_movimiento.f_anulacion,
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'medioTransferencia', null,
    'documentoTransaccion', null,
    'detalles', (
        select json_arrayagg( json_object(
            'id', entrada_pantalla_detalle.id,
            'pantallaModeloCalidad', null,
            'cantidad', entrada_pantalla_detalle.cant,
            'importeUnitario', entrada_pantalla_detalle.costo_uni
        ) )
        from entrada_pantalla_detalle
        where entrada_pantalla_detalle.entrada_pantalla_id = entrada_pantalla.id
    )
) as data
from entrada_pantalla
left join documento_movimiento on documento_movimiento.id = entrada_pantalla.id;



-- SALIDA PANTALLAS
select json_object(
    'id', documento_movimiento.id,
    'uuid', documento_movimiento.uuid,
    'codigo', documento_movimiento.codigo,
    'fechaEmision', documento_movimiento.f_emision,
    'fechaAnulacion', documento_movimiento.f_anulacion,
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'medioTransferencia', null,
    'documentoTransaccion', null,
    'detalles', (
        select json_arrayagg( json_object(
            'id', salida_pantalla_detalle.id,
            'pantallaModeloCalidad', null,
            'cantidad', salida_pantalla_detalle.cant,
            'importeUnitario', salida_pantalla_detalle.precio_uni
        ) )
        from salida_pantalla_detalle
        where salida_pantalla_detalle.salida_pantalla_id = salida_pantalla.id
    )
) as data
from salida_pantalla
left join documento_movimiento on documento_movimiento.id = salida_pantalla.id;



-- MOVIMIENTO PRODUCTOS
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
    'usuario', null,
    'concepto', movimiento_producto.concepto,
    'documentoTransaccion', null,
    'detalles', (
        select json_arrayagg( json_object(
            'id', movimiento_producto_detalle.id,
            'producto', null,
            'cantidad', movimiento_producto_detalle.cantidad,
            'importeUnitario', movimiento_producto_detalle.importeUnitario,
            'type', movimiento_producto_detalle.type
        ) )
        from movimiento_producto_detalle
        where movimiento_producto_detalle.movimientoProductoId = movimiento_producto.id
    ),
    'type', movimiento_producto.type
) as data
from movimiento_producto;



-- ENTRADA PRODUCTOS
select json_object(
    'id', documento_movimiento.id,
    'uuid', documento_movimiento.uuid,
    'codigo', documento_movimiento.codigo,
    'fechaEmision', documento_movimiento.f_emision,
    'fechaAnulacion', documento_movimiento.f_anulacion,
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'medioTransferencia', null,
    'documentoTransaccion', null,
    'detalles', (
        select json_arrayagg( json_object(
            'id', entrada_producto_detalle.id,
            'producto', null,
            'cantidad', entrada_producto_detalle.cant,
            'importeUnitario', entrada_producto_detalle.costo_uni
        ) )
        from entrada_producto_detalle
        where entrada_producto_detalle.entrada_producto_id = entrada_producto.id
    )
) as data
from entrada_producto
left join documento_movimiento on documento_movimiento.id = entrada_producto.id;



-- SALIDA PRODUCTOS
select json_object(
    'id', documento_movimiento.id,
    'uuid', documento_movimiento.uuid,
    'codigo', documento_movimiento.codigo,
    'fechaEmision', documento_movimiento.f_emision,
    'fechaAnulacion', documento_movimiento.f_anulacion,
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'medioTransferencia', null,
    'documentoTransaccion', null,
    'detalles', (
        select json_arrayagg( json_object(
            'id', salida_producto_detalle.id,
            'producto', null,
            'cantidad', salida_producto_detalle.cant,
            'importeUnitario', salida_producto_detalle.precio_uni
        ) )
        from salida_producto_detalle
        where salida_producto_detalle.salida_producto_id = salida_producto.id
    )
) as data
from salida_producto
left join documento_movimiento on documento_movimiento.id = salida_producto.id;



-- DOCUMENTOS MOVIMIENTO
with cte_documento_movimiento as (

    select
        entrada_efectivo.id as id,
        entrada_efectivo.efectivo as importeNeto,
        'EntradaEfectivo' as type
    from entrada_efectivo

    union all

    select
        salida_efectivo.id as id,
        salida_efectivo.efectivo as importeNeto,
        'SalidaEfectivo' as type
    from salida_efectivo

    union all

    select
        entrada_pantalla.id as id,
        sum( entrada_pantalla_detalle.cant * entrada_pantalla_detalle.costo_uni ) as importeNeto,
        'EntradaPantalla' as type
    from entrada_pantalla
    left join entrada_pantalla_detalle on entrada_pantalla_detalle.entrada_pantalla_id = entrada_pantalla.id
    group by entrada_pantalla.id

    union all

    select
        salida_pantalla.id as id,
        sum( salida_pantalla_detalle.cant * salida_pantalla_detalle.precio_uni ) as importeNeto,
        'SalidaPantalla' as type
    from salida_pantalla
    left join salida_pantalla_detalle on salida_pantalla_detalle.salida_pantalla_id = salida_pantalla.id
    group by salida_pantalla.id

    union all

    select
        entrada_producto.id as id,
        sum( entrada_producto_detalle.cant * entrada_producto_detalle.costo_uni ) as importeNeto,
        'EntradaProducto' as type
    from entrada_producto
    left join entrada_producto_detalle on entrada_producto_detalle.entrada_producto_id = entrada_producto.id
    group by entrada_producto.id

    union all

    select
        salida_producto.id as id,
        sum( salida_producto_detalle.cant * salida_producto_detalle.precio_uni ) as importeNeto,
        'SalidaProducto' as type
    from salida_producto
    left join salida_producto_detalle on salida_producto_detalle.salida_producto_id = salida_producto.id
    group by salida_producto.id

)
select json_object(
    'id', documento_movimiento.id,
    'uuid', documento_movimiento.uuid,
    'codigo', documento_movimiento.codigo,
    'fechaEmision', documento_movimiento.f_emision,
    'fechaAnulacion', documento_movimiento.f_anulacion,
    'usuario', null,
    'concepto', documento_movimiento.concepto,
    'importeNeto', cte_documento_movimiento.importeNeto,
    'documentoTransaccion', null,
    'type', cte_documento_movimiento.type
) as data
from documento_movimiento
left join cte_documento_movimiento on cte_documento_movimiento.id = documento_movimiento.id;




------- PRUEBAS

-- MOVIMIENTO EFECTIVO

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
            'uuid', documento_transaccion.id,
            'codigoSerie', documento_transaccion.cod_serie,
            'codigoNumero', documento_transaccion.cod_numero
        ) as data
        from documento_transaccion
        where documento_transaccion.id = documento_movimiento.documento_transaccion_id
    ),
    'type', movimiento_efectivo.type
) as data
from movimiento_efectivo
left join documento_movimiento on documento_movimiento.id = movimiento_efectivo.id
left join medio_transferencia on medio_transferencia.id = movimiento_efectivo.medioTransferenciaId;


