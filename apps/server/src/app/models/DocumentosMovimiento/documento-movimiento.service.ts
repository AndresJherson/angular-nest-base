import { Injectable } from '@nestjs/common';
import { AppService } from '../../app.service';
import { ConectorService } from '../../services/conector.service';
import { SessionData } from '../../interfaces/interfaces';
import { DocumentoMovimiento } from '@app/models';

@Injectable()
export class DocumentoMovimientoService {

    query = `
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
            'importeNeto', cte_documento_movimiento.importeNeto,
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
            'type', cte_documento_movimiento.type
        ) as data
        from documento_movimiento
        left join cte_documento_movimiento on cte_documento_movimiento.id = documento_movimiento.id
    `;


    constructor(
        private appService: AppService,
        private conectorService: ConectorService
    )
    {
        this.appService.register({
            documentoMovimiento: {
                getCollection: s => this.getCollection( s )
            }
        })
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'documento_movimiento' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery<DocumentoMovimiento>({
            transaction: s.transaction,
            query: this.query
        });
    }
}
