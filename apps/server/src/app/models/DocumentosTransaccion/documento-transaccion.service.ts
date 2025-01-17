import { Injectable } from '@nestjs/common';
import { AppService } from '../../app.service';
import { ConectorService } from '../../services/conector.service';
import { SessionData } from '../../interfaces/interfaces';
import { Cliente, DocumentoTransaccion } from '@app/models';

@Injectable()
export class DocumentoTransaccionService {

    query = `
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
        left join documento_transaccion on documento_transaccion.id = cte_documento_transaccion.id
    `;


    constructor(
        private appService: AppService,
        private conectorService: ConectorService
    )
    {
        this.appService.register({
            documentoTransaccion: {
                getCollection: s => this.getCollection( s ),
                getCollectionIssued: s => this.getCollectionIssued( s ),
                getCollectionPorCliente: s => this.getCollectionPorCliente( s, new Cliente( s.json.cliente ) )
            }
        });
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: DocumentoTransaccion.initialize,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getCollectionIssued( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: DocumentoTransaccion.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                where documento_transaccion.f_emision is not null
                and documento_transaccion.f_anulacion is null
            `
        });
    }


    async getCollectionPorCliente( s: SessionData, cliente: Cliente )
    {
        return await this.conectorService.executeQuery({
            target: DocumentoTransaccion.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                where cte_documento_transaccion.clienteId = :id
            `,
            parameters: {
                id: cliente.id ?? null
            }
        });
    }

}
