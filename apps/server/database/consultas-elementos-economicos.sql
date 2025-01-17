use servicio_tecnico;

-- magnitud tipo
select json_object(
    'id', magnitud_tipo.id,
    'nombre', magnitud_tipo.nombre
) as magnitudTipo
from magnitud_tipo;

-- magnitud
select json_object(
    'id', magnitud.id,
    'nombre', magnitud.nombre,
    'magnitudTipo', (
        select json_object(
            'id', magnitud_tipo.id,
            'nombre', magnitud_tipo.nombre
        )
        from magnitud_tipo
        where magnitud_tipo.id = magnitud.magnitud_tipo_id
    )
) as magnitud
from magnitud;


-- ELEMENTOS ECONOMICOS
with cte_elemento_economico as (

    select
        servicio.id as id,
        servicio.nombre as nombre,
        'uni' as magnitudNombre,
        servicio_categoria.nombre as categoria,
        servicio.precio_uni as precioUnitario,
        servicio.es_salida as esSalida,
        'Servicio' as type
    from servicio
    left join servicio_categoria on servicio_categoria.id = servicio.servicio_categoria_id

    union all

    select
        producto.id as id,
        concat(
            bien_marca.nombre, ' ',
            bien.nombre
        ) as nombre,
        magnitud.nombre as magnitudNombre,
        bien_categoria.nombre as categoria,
        producto.precio_uni as precioUnitario,
        producto.es_salida as esSalida,
        'Producto' as type
    from producto
    left join bien on bien.id = producto.id
    left join bien_marca on bien_marca.id = bien.bien_marca_id
    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
    left join magnitud on magnitud.id = bien.magnitud_id

    union all

    select
        bien_capital.id as id,
        concat(
            bien_marca.nombre, ' ',
            bien.nombre
        ) as nombre,
        magnitud.nombre as magnitudNombre,
        bien_categoria.nombre as categoria,
        bien_capital.valor_residual as precioUnitario,
        bien_capital.es_salida as esSalida,
        'BienCapital' as type
    from bien_capital
    left join bien on bien.id = bien_capital.id
    left join bien_marca on bien_marca.id = bien.bien_marca_id
    left join bien_categoria on bien_categoria.id = bien.bien_categoria_id
    left join magnitud on magnitud.id = bien.magnitud_id
    
    union all

    select
        pantalla_modelo_calidad.id as id,
        concat(
            pantalla_marca.nombre, ' ',
            pantalla_modelo.nombre, ' ',
            calidad.nombre
        ) as nombre,
        'uni' as magnitudNombre,
        'pantallas' as categoria,
        pantalla_modelo_calidad.precio_uni as precioUnitario,
        1 as esSalida,
        'PantallaModeloCalidad' as type
    from pantalla_modelo_calidad
    left join pantalla_modelo on pantalla_modelo.id = pantalla_modelo_calidad.pantalla_modelo_id
    left join pantalla_marca on pantalla_marca.id = pantalla_modelo.pantalla_marca_id
    left join calidad on calidad.id = pantalla_modelo_calidad.calidad_id

)
select json_object(
    'id', elemento_economico.id,
    'uuid', elemento_economico.uuid,
    'codigo', elemento_economico.codigo,
    'nombre', cte_elemento_economico.nombre,
    'magnitudNombre', cte_elemento_economico.magnitudNombre,
    'categoria', cte_elemento_economico.categoria,
    'precioUnitario', cte_elemento_economico.precioUnitario,
    'esSalida', cte_elemento_economico.esSalida,
    'type', cte_elemento_economico.type
) as data
from cte_elemento_economico
left join elemento_economico on elemento_economico.id = cte_elemento_economico.id;


-- Elementos Economicos con tipos
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
from cte_elemento_economico;




-- SERVICIOS

-- servicio categoria
select json_object(
    'id', servicio_categoria.id,
    'nombre', servicio_categoria.nombre
) as servicioCategoria
from servicio_categoria;

-- servicio
select json_object(
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
    'esSalida', servicio.es_salida
) as servicio 
from servicio
left join elemento_economico on elemento_economico.id = servicio.id;



-- BIENES

-- bien marca
select json_object(
    'id', bien_marca.id,
    'nombre', bien_marca.nombre
) as bienMarca
from bien_marca;

-- bien categoria
select json_object(
    'id', bien_categoria.id,
    'nombre', bien_categoria.nombre
) as bienCategoria
from bien_categoria;

-- producto
select json_object(
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
    'esSalida', producto.es_salida
) as data
from producto
left join bien on bien.id = producto.id
left join elemento_economico on elemento_economico.id = bien.id;

-- bien capital
select json_object(
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
    'esSalida', bien_capital.es_salida
) as bien_capital
from bien_capital
left join bien on bien.id = bien_capital.id
left join elemento_economico on elemento_economico.id = bien.id;



-- PANTALLAS


-- pantalla marca
select json_object(
    'id', pantalla_marca.id,
    'nombre', pantalla_marca.nombre
) as pantallaMarca
from pantalla_marca;


-- pantalla modelo
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
from pantalla_modelo;


-- calidad
select json_object(
    'id', calidad.id,
    'nombre', calidad.nombre
) as calidad
from calidad;


-- pantalla modelo calidad
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
left join elemento_economico on elemento_economico.id = pantalla_modelo_calidad.id;


-- Elementos Economicos salida
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
;