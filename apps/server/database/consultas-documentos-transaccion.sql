
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
    'uuid', documento_transaccion.id,
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