import { Injectable } from '@nestjs/common';
import { ConectorService } from '../../../services/conector.service';
import { SessionData } from '../../../interfaces/interfaces';
import { CreditoCobrar } from '../../../../../../models/src/lib/DocumentosTransaccion/CreditoCobrar/CreditoCobrar';
import { NotaVentaCredito } from 'apps/models/src/lib/DocumentosTransaccion/NotaVenta/NotaVentaCredito';
import { SQLBuilder } from '../../../services/SQLBuilder';
import { CuotaCobrar } from 'apps/models/src/lib/DocumentosTransaccion/CreditoCobrar/CuotaCobrar';
import { NotaVentaCuota } from '../../../../../../models/src/lib/DocumentosTransaccion/NotaVenta/NotaVentaCuota';

@Injectable()
export class CreditoCobrarService {


    constructor(
        private contectorService: ConectorService
    )
    {}


    async executeCreditoCobrar( s: SessionData, credito: CreditoCobrar )
    {
        const affectedRows1 = await this.contectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'credito_cobrar' )
            .values([
                {
                    id: credito.id ?? null,
                    cliente_id: credito.cliente?.id ?? null,
                    receptor_documento_identificacion_id: credito.cliente?.id
                                                            ? null
                                                            : ( credito.receptorDocumentoIdentificacion?.id ?? null ),
                    receptor_cod: credito.cliente?.id
                                    ? null
                                    : ( credito.receptorCodigo ?? null ),
                    receptor_nombre: credito.cliente?.id
                                    ? null
                                    : ( credito.receptorNombre ?? null ),
                    receptor_celular: credito.cliente?.id
                                    ? null
                                    : ( credito.receptorCelular ?? null ),
                    tasa_interes_diario: credito.tasaInteresDiario ?? 0,
                    importe_capital_inicial: credito.importeCapitalInicial ?? 0,
                    importe_interes: credito.importeInteres ?? 0
                }
            ])
        });


        const affectedRows2 = await this.contectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'cuota_cobrar' )
            .values( credito.cuotas.map( cuota => (
                {
                    id: cuota.id ?? null,
                    credito_cobrar_id: cuota.credito?.id ?? null,
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
