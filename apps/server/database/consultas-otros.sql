-- POLITICA
select json_object(
    'id', politica.id,
    'descripcion', politica.descripcion,
    'esActivo', politica.es_activo
) as data
from politica;