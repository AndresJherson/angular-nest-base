import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { NotaVenta } from '../../../../../../models/src/lib/DocumentosTransaccion/NotaVenta/NotaVenta';
import { ERROR_CRUD } from '../../../interfaces/constants';
import { v4 } from 'uuid';
import { NotaService } from '../nota.service';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { Prop } from 'apps/models/src/lib/Model';
import { AppService } from '../../../app.service';

@Injectable()
export class NotaVentaService {

    query = ``;


    constructor(
        private conectorService: ConectorService,
        private notaService: NotaService,
        private appService: AppService
    )
    {
        this.appService.register({
            notaVenta: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new NotaVenta( s.json.notaVenta ) ),
                createItem: s => this.createItem( s, new NotaVenta( s.json.notaVenta ) ),
                updateItem: s => this.updateItem( s, new NotaVenta( s.json.notaVenta ) ),
                updateItemIssued: s => this.updateItemIssue( s, new NotaVenta( s.json.notaVenta ) ),
                updateItemCancel: s => this.updateItemCancel( s, new NotaVenta( s.json.notaVenta ) ),
                deleteItem: s => this.deleteItem( s, new NotaVenta( s.json.notaVenta ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'documento_transaccion' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: NotaVenta,
            transaction: s.transaction,
            query: this.query
        });
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

        return data[ 0 ];
    }


    async executeNotaVenta( s: SessionData, notaVenta: NotaVenta )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'documento_transaccion' )
            .values([
                {
                    id: notaVenta.id ?? null,
                    uuid: notaVenta.uuid ?? null,
                    cod_serie: notaVenta.codigoSerie ?? null,
                    cod_mumero: notaVenta.codigoNumero ?? null,
                    f_creacion: notaVenta.fechaCreacion ?? null,
                    f_actualizacion: notaVenta.fechaActualizacion ?? null,
                    f_emision: notaVenta.fechaEmision ?? null,
                    f_anulacion: notaVenta.fechaAnulacion ?? null,
                    usuario_id: notaVenta.usuario?.id ?? null,
                    concepto: notaVenta.concepto ?? null,
                    carpeta_id: notaVenta.carpeta?.id ?? null
                }
            ])
        });

        
        let affectedRows2 = 0;
        if ( notaVenta.notas.length > 0 ) {

            affectedRows2 = await this.notaService.executeNotaCollection( s, notaVenta.notas );

        }


        const affectedRows3 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'nota_venta' )
            .values([
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
                    liquidacion_tipo_id: notaVenta.liquidacionTipo?.id ?? null,
                    importe_anticipo: notaVenta.importeAnticipo ?? null
                }
            ])
        });


        let affectedRows4 = 0;
        if ( notaVenta.detalles.length > 0 ) {

            affectedRows4 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder.insert( 'nota_venta_detalle' )
                .values( notaVenta.detalles.map( detalle => (
                    {
                        id: detalle.id ?? null,
                        nota_venta_id: detalle.notaVenta?.id ?? null,
                        elemento_economico_id: detalle.elementoEconomico?.id ?? null,
                        concepto: detalle.concepto ?? null,
                        cant: detalle.cantidad ?? 0,
                        precio_uni: detalle.importeUnitario ?? 0,
                        descuento: detalle.importeDescuento ?? 0,
                        comentario: detalle.comentario ?? null
                    }
                ) ) )
            });
        }


        let affectedRows5 = 0;
        let affectedRows6 = 0;
        if ( notaVenta.liquidacionTipo?.id === 2 ) {

            notaVenta.credito.set({
                id: await this.conectorService.getId( s.transaction, 'nota_venta_credito' )
            });

            affectedRows5 = await this.conectorService.executeNonQuery({
                transaction: s.transaction,
                ...SQLBuilder
                .insert( 'nota_venta_credito' )
                .values([
                    {
                        id: notaVenta.credito.id ?? null,
                        nota_venta_id: notaVenta.id ?? null,
                        tasa_interes_diario: notaVenta.credito.tasaInteresDiario ?? 0,
                        importe_capital_inicial: notaVenta.credito.importeCapitalInicial ?? 0,
                        importe_interes: notaVenta.credito.importeInteres ?? 0
                    }
                ]),
            });


            if ( notaVenta.credito.cuotas.length > 0 ) {

                affectedRows6 = await this.conectorService.executeNonQuery({
                    transaction: s.transaction,
                    ...SQLBuilder.insert( 'nota_venta_cuota' )
                    .values( notaVenta.credito.cuotas.map( cuota => (
                        {
                            id: cuota.id ?? null,
                            nota_venta_credito_id: cuota.credito?.id ?? null,
                            numero: cuota.numero ?? 0,
                            f_inicio: cuota.fechaInicio ?? null,
                            f_vencimiento: cuota.fechaVencimiento ?? null,
                            cuota: cuota.importeCuota ?? 0,
                            amortizacion: cuota.importeAmortizacion ?? 0,
                            interes: cuota.importeInteres ?? 0,
                            saldo: cuota.importeSaldo ?? 0
                        }
                    ) ) )
                });
            }

        }


        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0 &&
            affectedRows4 === 0 &&
            affectedRows5 === 0 &&
            affectedRows6 === 0 
        ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
    }


    async createItem( s: SessionData, notaVenta: NotaVenta )
    {
        notaVenta.set({
            uuid: v4()
        })
        .setKeysSQL({
            id: await this.getId( s ),
            notaId: await this.conectorService.getId( s.transaction, 'nota' ),
            detalleId: await this.conectorService.getId( s.transaction, 'nota_venta_detalle' ),
            creditoId: await this.conectorService.getId( s.transaction, 'nota_venta_credito' ),
            cuotaId: await this.conectorService.getId( s.transaction, 'nota_venta_cuota' )
        })
        .calcularInformacion();

        await this.executeNotaVenta( s, notaVenta );
        
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
                uuid: notaVenta2verify.uuid,
                fechaCreacion: notaVenta2verify.fechaCreacion
            })
            .setKeysSQL({
                id: notaVenta.id ?? NaN,
                notaId: await this.conectorService.getId( s.transaction, 'nota' ),
                detalleId: await this.conectorService.getId( s.transaction, 'nota_venta_detalle' ),
                creditoId: await this.conectorService.getId( s.transaction, 'nota_venta_credito' ),
                cuotaId: await this.conectorService.getId( s.transaction, 'nota_venta_cuota' )
            })
            .calcularInformacion();

            return await this.executeNotaVenta( s, notaVenta );
        }
        catch ( error ) {
            throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        }
    }


    async updateItemIssue( s: SessionData, notaVenta: NotaVenta )
    {
        const notaVenta2verify = await this.getItem( s, notaVenta );
        if ( notaVenta2verify.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );
        if ( notaVenta2verify.fechaEmision ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_EMITIDO );

        const codigoSerie = `NTDVNT${notaVenta.fechaEmision ?? ''}`;

        const data: { codigoNumero: number }[] = await this.conectorService.executeQuery({
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

        if ( data.length === 0 ) throw new InternalServerErrorException( 'Error inesperado en la emisión' );
        const numero = Prop.setNumberStrict( data[0].codigoNumero ) ?? 1;

        notaVenta.set({
            codigoSerie: codigoSerie,
            codigoNumero: numero
        });

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'documento_transaccion' )
            .set({
                f_actualizacion: notaVenta.fechaActualizacion ?? null,
                f_emision: notaVenta.fechaEmision ?? null,
                cod_serie: notaVenta.codigoSerie,
                cod_numero: notaVenta.codigoNumero
            })
            .where({
                id: notaVenta.id
            })
        });

        return await this.getItem( s, notaVenta );
    }


    async updateItemCancel( s: SessionData, notaVenta: NotaVenta )
    {
        const notaVenta2verify = await this.getItem( s, notaVenta );
        if ( notaVenta2verify.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'documento_transaccion' )
            .set({
                f_actualizacion: notaVenta.fechaActualizacion ?? null,
                f_anulacion: notaVenta.fechaAnulacion ?? null,
            })
            .where({
                id: notaVenta.id
            })
        });

        return await this.getItem( s, notaVenta );
    }


    async deleteItem( s: SessionData, notaVenta: NotaVenta )
    {
        const notaVenta2delete = await this.getItem( s, notaVenta );
        if ( notaVenta2delete.fechaAnulacion ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_ANULADO );
        if ( notaVenta2delete.fechaEmision ) throw new InternalServerErrorException( ERROR_CRUD.DOCUMENTO_EMITIDO );


        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete nota_venta_cuota
                from nota_venta_cuota
                left join nota_venta_credito on nota_venta_credito.id = nota_venta_cuota.nota_venta_credito_id
                where nota_venta_credito.nota_venta_id = :id
            `,
            parameters: {
                id: notaVenta.id ?? null,
            }
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete from nota_venta_credito
                where nota_venta_credito.nota_venta_id = :id
            `,
            parameters: {
                id: notaVenta.id ?? null,
            }
        });


        const affectedRows3 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete from nota_venta_detalle
                where nota_venta_id = :id
            `,
            parameters: {
                id: notaVenta.id ?? null,
            }
        });


        const affectedRows4 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete from nota_venta
                where id = :id
            `,
            parameters: {
                id: notaVenta.id ?? null,
            }
        });


        const affectedRows5 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete from nota
                where nota.documento_transaccion_id = :id
            `,
            parameters: {
                id: notaVenta.id ?? null,
            }
        });


        const affectedRows6 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            query: `
                delete from documento_transaccion
                where id = :id
            `,
            parameters: {
                id: notaVenta.id ?? null,
            }
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
}