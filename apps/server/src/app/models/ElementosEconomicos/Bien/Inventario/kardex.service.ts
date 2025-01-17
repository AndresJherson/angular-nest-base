import { Bien, BienInventario, Kardex, KardexMovimiento, PantallaModeloCalidad, Producto } from '@app/models';
import { Injectable } from '@nestjs/common';
import { ConectorService } from 'apps/server/src/app/services/conector.service';
import { join } from 'path';
import { SessionData } from '../../../../interfaces/interfaces';

@Injectable()
export class KardexService {

    private pathKardexPython: string = join( __dirname, 'assets', 'kardex.py' );

    constructor(
        private conectorService: ConectorService
    )
    {}


    async metodoPromedio( s: SessionData, bien: Bien )
    {
        const type = bien instanceof Producto
                        ? Producto.type
                    : bien instanceof PantallaModeloCalidad
                        ? PantallaModeloCalidad.type
                        : ''

        const kardex = new Kardex({
            articulo: bien,
            metodo: 'Promedio'
        });

        const inputData = {
            id: bien.id,
            type: type
        }

        const outputData: {
            movimientos: KardexMovimiento[],
            total: BienInventario
        } = await this.conectorService.runPythonScript( this.pathKardexPython, inputData )

        kardex.set({
            movimientos: outputData.movimientos,
            total: new BienInventario({
                ...bien,
                ...outputData.total,
                type: BienInventario.type
            })
        });

        console.log( kardex )

        return kardex;
    }
}
