-- documento_identificacion
select json_object(
    'id', documento_identificacion.id,
    'nombre', documento_identificacion.nombre
) as documentoIdentificacion
from documento_identificacion;


-- genero
select json_object(
    'id', genero.id,
    'nombre', genero.nombre
) as genero
from genero;


-- cliente
select json_object(
    'id', cliente.id,
    'documentoIdentificacion',(
        select json_object(
            'id', documento_identificacion.id,
            'nombre', documento_identificacion.nombre
        ) as documentoIdentificacion
        from documento_identificacion
        where documento_identificacion.id = cliente.documento_identificacion_id
    ),
    'codigo', cliente.codigo,
    'nombre', cliente.nombre,
    'apellido', cliente.apellido,
    'genero', (
        select json_object(
            'id', genero.id,
            'nombre', genero.nombre
        ) as genero
        from genero
        where genero.id = cliente.genero_id
    ),
    'celular', cliente.celular,
    'celularRespaldo', cliente.celular_respaldo
) as cliente
from cliente;


-- usuario
select json_object(
    'id', usuario.id,
    'nombre', usuario.nombre,
    'usuario', usuario.usuario,
    'contrasena', usuario.contrasena,
    'esActivo', usuario.es_activo
) as usuario
from usuario;


-- empleado
select json_object(
    'id', empleado.id,
    'documentoIdentificacion', (
        select json_object(
            'id', documento_identificacion.id,
            'nombre', documento_identificacion.nombre
        )
        from documento_identificacion
        where documento_identificacion.id = empleado.documento_identificacion_id
    ),
    'codigo', empleado.cod,
    'nombre', empleado.nombre,
    'apellido', empleado.apellido,
    'domicilio', empleado.domicilio,
    'genero', (
        select json_object(
            'id', genero.id,
            'nombre', genero.nombre
        )
        from genero
        where genero.id = empleado.genero_id
    ),
    'celular', empleado.celular,
    'celularRespaldo', empleado.celular_respaldo,
    'esTecnico', empleado.es_tecnico,
    'usuario', (
        select json_object(
            'id', usuario.id,
            'nombre', usuario.nombre,
            'usuario', usuario.usuario,
            'contrasena', usuario.contrasena,
            'esActivo', usuario.es_activo
        )
        from usuario
        where usuario.id = empleado.usuario_id
    )
)
from empleado;



-- ESTABLECIMIENTO
select json_object(
    'id', establecimiento.id,
    'ruc', establecimiento.ruc,
    'razonSocial', establecimiento.razon_social,
    'rubro', establecimiento.rubro,
    'domicilio', establecimiento.domicilio,
    'celular', establecimiento.celular
)
from establecimiento;