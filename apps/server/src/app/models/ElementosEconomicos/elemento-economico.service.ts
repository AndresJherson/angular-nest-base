import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../services/conector.service';
import { SessionData } from '../../interfaces/interfaces';
import { ElementoEconomico, Prop } from '@app/models';
import { ERROR_CRUD } from '../../interfaces/constants';
import { AppService } from '../../app.service';

@Injectable()
export class ElementoEconomicoService {

    query = `
        with cte_elemento_economico as (

            select 
                elemento_economico.id as id,
                elemento_economico.codigo as codigo,
                servicio.es_salida as esSalida,
                json_object(
                    'id', servicio.id,
                    'uuid', elemento_economico.uuid,
                    'codigo', elemento_economico.codigo,
                    'nombre', servicio.nombre,
                    'magnitudNombre', 'uni',
                    'categoriaNombre', (
                        select 
                            servicio_categoria.nombre
                        from servicio_categoria
                        where servicio_categoria.id = servicio.servicio_categoria_id
                    ),
                    'servicioCategoria', (
                        select json_object(
                            'id', servicio_categoria.id,
                            'nombre', servicio_categoria.nombre
                        )
                        from servicio_categoria
                        where servicio_categoria.id = servicio.servicio_categoria_id
                    ),
                    'precioUnitario', servicio.precio_uni,
                    'esSalida', servicio.es_salida,
                    'type', 'Servicio'
                ) as json
            from servicio
            left join elemento_economico on elemento_economico.id = servicio.id

            union all

            select 
                elemento_economico.id as id,
                elemento_economico.codigo as codigo,
                producto.es_salida as esSalida,
                json_object(
                    'id', producto.id,
                    'uuid', elemento_economico.uuid,
                    'codigo', elemento_economico.codigo,
                    'nombre', (
                        select
                            concat(
                                bien.nombre, ' ',
                                bien_marca.nombre, ' ',
                                magnitud.nombre
                            )
                        from bien_marca
                        left join magnitud on magnitud.id = bien.magnitud_id
                        where bien_marca.id = bien.bien_marca_id
                    ), 
                    'magnitudNombre', (
                        select 
                            magnitud.nombre
                        from magnitud
                        where magnitud.id = bien.magnitud_id
                    ),
                    'categoriaNombre', (
                        select 
                            bien_categoria.nombre
                        from bien_categoria
                        where bien_categoria.id = bien.bien_categoria_id
                    ),
                    'magnitud', (
                        select json_object(
                            'id', magnitud.id,
                            'nombre', magnitud.nombre,
                            'magnitudTipo', (
                                select json_object(
                                    'id', magnitud_tipo.id,
                                    'nombre', magnitud_tipo.nombre
                                ) as magnitud_tipo
                                from magnitud_tipo
                                where magnitud_tipo.id = magnitud.magnitud_tipo_id
                            )
                        ) as magnitud
                        from magnitud
                        where magnitud.id = bien.magnitud_id
                    ),
                    'bienMarca', (
                        select json_object(
                            'id', bien_marca.id,
                            'nombre', bien_marca.nombre
                        ) as bien_marca
                        from bien_marca
                        where bien_marca.id = bien.bien_marca_id
                    ),
                    'bienCategoria', (
                        select json_object(
                            'id', bien_categoria.id,
                            'nombre', bien_categoria.nombre
                        ) as bien_categoria
                        from bien_categoria
                        where bien_categoria.id = bien.bien_categoria_id
                    ),
                    'precioUnitario', producto.precio_uni,
                    'esSalida', producto.es_salida,
                    'type', 'Producto'
                ) as json
            from producto
            left join bien on bien.id = producto.id
            left join elemento_economico on elemento_economico.id = bien.id

            union all

            select 
                elemento_economico.id as id,
                elemento_economico.codigo as codigo,
                bien_capital.es_salida as esSalida,
                json_object(
                    'id', bien_capital.id,
                    'uuid', elemento_economico.uuid,
                    'codigo', elemento_economico.codigo,
                    'nombre', (
                        select
                            concat(
                                bien.nombre, ' ',
                                bien_marca.nombre, ' ',
                                magnitud.nombre
                            )
                        from bien_marca
                        left join magnitud on magnitud.id = bien.magnitud_id
                        where bien_marca.id = bien.bien_marca_id
                    ),
                    'magnitudNombre', (
                        select 
                            magnitud.nombre
                        from magnitud
                        where magnitud.id = bien.magnitud_id
                    ),
                    'categoriaNombre', (
                        select 
                            bien_categoria.nombre
                        from bien_categoria
                        where bien_categoria.id = bien.bien_categoria_id
                    ),
                    'magnitud', (
                        select json_object(
                            'id', magnitud.id,
                            'nombre', magnitud.nombre,
                            'magnitudTipo', (
                                select json_object(
                                    'id', magnitud_tipo.id,
                                    'nombre', magnitud_tipo.nombre
                                ) as magnitud_tipo
                                from magnitud_tipo
                                where magnitud_tipo.id = magnitud.magnitud_tipo_id
                            )
                        ) as magnitud
                        from magnitud
                        where magnitud.id = bien.magnitud_id
                    ),
                    'bienMarca', (
                        select json_object(
                            'id', bien_marca.id,
                            'nombre', bien_marca.nombre
                        ) as bien_marca
                        from bien_marca
                        where bien_marca.id = bien.bien_marca_id
                    ),
                    'bienCategoria', (
                        select json_object(
                            'id', bien_categoria.id,
                            'nombre', bien_categoria.nombre
                        ) as bien_categoria
                        from bien_categoria
                        where bien_categoria.id = bien.bien_categoria_id
                    ),
                    'fechaAlta', bien_capital.f_alta,
                    'fechaBaja', bien_capital.f_baja,
                    'valorInicial', bien_capital.valor_inicial,
                    'valorResidual', bien_capital.valor_residual,
                    'esSalida', bien_capital.es_salida,
                    'type', 'BienCapital'
                ) as json
            from bien_capital
            left join bien on bien.id = bien_capital.id
            left join elemento_economico on elemento_economico.id = bien.id

            union all

            select 
                elemento_economico.id as id,
                elemento_economico.codigo as codigo,
                1 as esSalida,
                json_object(
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
                    'precioUnitario', pantalla_modelo_calidad.precio_uni,
                    'type', 'PantallaModeloCalidad'
                ) as json
            from pantalla_modelo_calidad
            left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id

        )
        select
            cte_elemento_economico.json
        from cte_elemento_economico
    `;


    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            elementoEconomico : {
                getCollection: s => this.getCollection( s ),
                getCollectionEsSalida: s => this.getCollectionEsSalida( s ),
                getItemPorCodigo: s => this.getItemPorCodigo( s, new ElementoEconomico( s.json.elementoEconomico ) ),
                getItemType: s => this.getItemType( s, ElementoEconomico.initialize([ Prop.setObject( s.json.elementoEconomico ) ])[0] )
            }
        });
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: ElementoEconomico.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                order by cte_elemento_economico.id
            `
        });
    }


    async getCollectionEsSalida( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: ElementoEconomico.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                where cte_elemento_economico.esSalida = 1
                order by cte_elemento_economico.id
            `
        });
    }


    async getItemPorCodigo( s: SessionData, elementoEconomico: ElementoEconomico )
    {
        const data = await this.conectorService.executeQuery({
            target: ElementoEconomico.initialize,
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


    async getItemType( s: SessionData, elementoEconomico: ElementoEconomico )
    {
        const data = await this.conectorService.executeQuery({
            target: ElementoEconomico.initialize,
            transaction: s.transaction,
            query: `
                ${this.query}
                where cte_elemento_economico.id = :id
            `,
            parameters: {
                id: elementoEconomico.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }
}