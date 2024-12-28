import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../services/conector.service';
import { SessionData } from '../../interfaces/interfaces';
import { ElementoEconomico } from '../../../../../models/src/lib/ElementosEconomicos/ElementoEconomico';
import { ERROR_CRUD } from '../../interfaces/constants';
import { AppService } from '../../app.service';

@Injectable()
export class ElementoEconomicoService {

    query = `
        with cte_elemento_economico as (

            select
                pantalla_modelo_calidad.id as id,
                elemento_economico.uuid as uuid,
                elemento_economico.codigo as codigo,
                concat(
                    pantalla_marca.nombre, ' ',
                    pantalla_modelo.nombre, ' ',
                    calidad.nombre
                ) as nombre,
                'uni' as magnitudNombre,
                'pantalla celular' as categoria,
                pantalla_modelo_calidad.precio_uni as precioUnitario,
                1 as esSalida
            from pantalla_modelo_calidad
            left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id
            left join pantalla_modelo on pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
            left join pantalla_marca on pantalla_marca.id = pantalla_modelo.pantalla_marca_id
            left join calidad on calidad.id = pantalla_modelo_calidad.calidad_id

            union all
            
            select
                producto.id as id,
                elemento_economico.uuid as uuid,
                elemento_economico.codigo as codigo,
                concat(
                    bien_marca.nombre, ' ',
                    bien.nombre
                ) as nombre,
                magnitud.nombre as magnitudNombre,
                bien_categoria.nombre as categoria,
                producto.precio_uni as precioUnitario,
                producto.es_salida as esSalida
            from producto
            left join bien on bien.id = producto.id
            left join elemento_economico on elemento_economico.id = bien.id
            left join bien_marca on bien_marca.id = bien.bien_marca_id
            left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
            left join magnitud on magnitud.id = bien.magnitud_id
            
            union all
            
            select
                bien_capital.id as id,
                elemento_economico.uuid as uuid,
                elemento_economico.codigo as codigo,
                concat(
                    bien_marca.nombre, ' ',
                    bien.nombre, ' ',
                    magnitud.nombre
                ) as nombre,
                magnitud.nombre as magnitudNombre,
                bien_categoria.nombre as categoria,
                bien_capital.valor_residual as precioUnitario,
                bien_capital.es_salida as esSalida
            from bien_capital
            left join bien on bien.id = bien_capital.id
            left join elemento_economico on elemento_economico.id = bien.id
            left join bien_marca on bien_marca.id = bien.bien_marca_id
            left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
            left join magnitud on magnitud.id = bien.magnitud_id
            
            union all
            
            select
                servicio.id as id,
                elemento_economico.uuid as uuid,
                elemento_economico.codigo as codigo,
                servicio.nombre as nombre,
                'uni' as magnitudNombre,
                servicio_categoria.nombre as categoria,
                servicio.precio_uni as precioUnitario,
                servicio.es_salida as esSalida
            from servicio
            left join elemento_economico on elemento_economico.id = servicio.id
            left join servicio_categoria on servicio_categoria.id = servicio.servicio_categoria_id
            
        )
        select json_object(
            'id', cte_elemento_economico.id,
            'uuid', cte_elemento_economico.uuid,
            'codigo', cte_elemento_economico.codigo,
            'nombre', cte_elemento_economico.nombre,
            'magnitudNombre', cte_elemento_economico.magnitudNombre,
            'categoria', cte_elemento_economico.categoria,
            'precioUnitario', cte_elemento_economico.precioUnitario,
            'esSalida', cte_elemento_economico.esSalida
        ) as elementoEconomico
        from cte_elemento_economico
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            elementoEconomico : {
                getCollectionEsSalida: s => this.getCollectionEsSalida( s ),
                getItemPorCodigo: s => this.getItemPorCodigo( s, new ElementoEconomico( s.json.elementoEconomico ) )
            }
        });
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: ElementoEconomico,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getCollectionEsSalida( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: ElementoEconomico,
            transaction: s.transaction,
            query: `
                with cte_elemento_economico as (

                    select
                        pantalla_modelo_calidad.id as id,
                        elemento_economico.uuid as uuid,
                        elemento_economico.codigo as codigo,
                        concat(
                            pantalla_marca.nombre, ' ',
                            pantalla_modelo.nombre, ' ',
                            calidad.nombre
                        ) as nombre,
                        'uni' as magnitudNombre,
                        'pantalla celular' as categoria,
                        pantalla_modelo_calidad.precio_uni as precioUnitario,
                        1 as esSalida
                    from pantalla_modelo_calidad
                    left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id
                    left join pantalla_modelo on pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
                    left join pantalla_marca on pantalla_marca.id = pantalla_modelo.pantalla_marca_id
                    left join calidad on calidad.id = pantalla_modelo_calidad.calidad_id
                    where pantalla_modelo_calidad.es_salida = 1

                    union all
                    
                    select
                        producto.id as id,
                        elemento_economico.uuid as uuid,
                        elemento_economico.codigo as codigo,
                        concat(
                            bien_marca.nombre, ' ',
                            bien.nombre
                        ) as nombre,
                        magnitud.nombre as magnitudNombre,
                        bien_categoria.nombre as categoria,
                        producto.precio_uni as precioUnitario,
                        producto.es_salida as esSalida
                    from producto
                    left join bien on bien.id = producto.id
                    left join elemento_economico on elemento_economico.id = bien.id
                    left join bien_marca on bien_marca.id = bien.bien_marca_id
                    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
                    left join magnitud on magnitud.id = bien.magnitud_id
                    where producto.es_salida = 1
                    
                    union all
                    
                    select
                        bien_capital.id as id,
                        elemento_economico.uuid as uuid,
                        elemento_economico.codigo as codigo,
                        concat(
                            bien_marca.nombre, ' ',
                            bien.nombre, ' ',
                            magnitud.nombre
                        ) as nombre,
                        magnitud.nombre as magnitudNombre,
                        bien_categoria.nombre as categoria,
                        bien_capital.valor_residual as precioUnitario,
                        bien_capital.es_salida as esSalida
                    from bien_capital
                    left join bien on bien.id = bien_capital.id
                    left join elemento_economico on elemento_economico.id = bien.id
                    left join bien_marca on bien_marca.id = bien.bien_marca_id
                    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
                    left join magnitud on magnitud.id = bien.magnitud_id
                    where bien_capital.es_salida = 1
                    
                    union all
                    
                    select
                        servicio.id as id,
                        elemento_economico.uuid as uuid,
                        elemento_economico.codigo as codigo,
                        servicio.nombre as nombre,
                        'uni' as magnitudNombre,
                        servicio_categoria.nombre as categoria,
                        servicio.precio_uni as precioUnitario,
                        servicio.es_salida as esSalida
                    from servicio
                    left join elemento_economico on elemento_economico.id = servicio.id
                    left join servicio_categoria on servicio_categoria.id = servicio.servicio_categoria_id
                    where servicio.es_salida = 1
                    
                )
                select json_object(
                    'id', cte_elemento_economico.id,
                    'uuid', cte_elemento_economico.uuid,
                    'codigo', cte_elemento_economico.codigo,
                    'nombre', cte_elemento_economico.nombre,
                    'magnitudNombre', cte_elemento_economico.magnitudNombre,
                    'categoria', cte_elemento_economico.categoria,
                    'precioUnitario', cte_elemento_economico.precioUnitario,
                    'esSalida', cte_elemento_economico.esSalida
                ) as elementoEconomico
                from cte_elemento_economico
            `
        });
    }


    async getItemPorCodigo( s: SessionData, elementoEconomico: ElementoEconomico )
    {
        const data = await this.conectorService.executeQuery({
            target: ElementoEconomico,
            transaction: s.transaction,
            query: `
                ${this.query}
                where cte_elemento_economico.codigo = :codigo
            `,
            parameters: {
                codigo: elementoEconomico.codigo
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }
}