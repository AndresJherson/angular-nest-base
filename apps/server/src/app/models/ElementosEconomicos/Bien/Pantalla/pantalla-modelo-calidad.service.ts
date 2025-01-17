import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ERROR_CRUD } from 'apps/server/src/app/interfaces/constants';
import { SessionData } from 'apps/server/src/app/interfaces/interfaces';
import { ConectorService } from 'apps/server/src/app/services/conector.service';
import { PantallaModeloCalidad } from '@app/models';
import { v4 } from 'uuid';
import { SQLBuilder } from 'apps/server/src/app/services/SQLBuilder';
import { AppService } from 'apps/server/src/app/app.service';
import { KardexService } from '../Inventario/kardex.service';

@Injectable()
export class PantallaModeloCalidadService {

    query = `
        select json_object(
            'id', pantalla_modelo_calidad.id,
            'uuid', elemento_economico.uuid,
            'codigo', elemento_economico.codigo,
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
            'categoriaNombre', 'pantallas',
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
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService,
        private kardexService: KardexService
    )
    {
        this.appService.register({
            pantallaModeloCalidad: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new PantallaModeloCalidad( s.json.pantallaModeloCalidad ) ),
                createItem: s => this.createItem( s, new PantallaModeloCalidad( s.json.pantallaModeloCalidad ) ),
                updateItem: s => this.updateItem( s, new PantallaModeloCalidad( s.json.pantallaModeloCalidad ) ),
                deleteItem: s => this.deleteItem( s, new PantallaModeloCalidad( s.json.pantallaModeloCalidad ) ),
                kardexMetodoPromedio: s => this.kardexMetodoPromedio( s, new PantallaModeloCalidad( s.json.pantallaModeloCalidad ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'elemento_economico' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: PantallaModeloCalidad,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, pantallaModeloCalidad: PantallaModeloCalidad )
    {
        const data = await this.conectorService.executeQuery({
            target: PantallaModeloCalidad,
            transaction: s.transaction,
            query: `
                ${this.query}
                where pantalla_modelo_calidad.id = :id
            `,
            parameters: {
                id: pantallaModeloCalidad.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, pantallaModeloCalidad: PantallaModeloCalidad )
    {
        pantallaModeloCalidad.set({
            id: await this.getId( s ),
            uuid: v4()
        });

        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'elemento_economico' )
            .values([
                {
                    id: pantallaModeloCalidad.id ?? null,
                    uuid: pantallaModeloCalidad.uuid ?? null,
                    codigo: `PNTLL${pantallaModeloCalidad.id ?? ''}`
                }
            ])
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'pantalla_modelo_calidad' )
            .values([
                {
                    id: pantallaModeloCalidad.id ?? null,
                    pantalla_modelo_id: pantallaModeloCalidad.pantallaModelo?.id ?? null,
                    calidad_id: pantallaModeloCalidad.calidad?.id ?? null,
                    precio_uni: pantallaModeloCalidad.precioUnitario ?? 0
                }
            ])
        });


        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, pantallaModeloCalidad );
    }


    async updateItem( s: SessionData, pantallaModeloCalidad: PantallaModeloCalidad )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'pantalla_modelo_calidad' )
            .set({
                pantalla_modelo_id: pantallaModeloCalidad.pantallaModelo?.id ?? null,
                calidad_id: pantallaModeloCalidad.calidad?.id ?? null,
                precio_uni: pantallaModeloCalidad.precioUnitario ?? 0
            })
            .where({
                id: pantallaModeloCalidad.id ?? null,
            })
        });


        if ( affectedRows1 === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, pantallaModeloCalidad );
    }


    async deleteItem( s: SessionData, pantallaModeloCalidad: PantallaModeloCalidad )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'pantalla_modelo_calidad' )
            .where({
                id: pantallaModeloCalidad.id ?? null,
            })
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'elemento_economico' )
            .where({
                id: pantallaModeloCalidad.id ?? null,
            })
        });


        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
    

    async kardexMetodoPromedio( s: SessionData, pantallaModeloCalidad: PantallaModeloCalidad )
    {
        const pantallaModeloCalidad2send = await this.getItem( s, pantallaModeloCalidad );
        return await this.kardexService.metodoPromedio( s, pantallaModeloCalidad2send )
    }
}