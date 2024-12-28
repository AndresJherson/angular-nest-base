import Decimal from "decimal.js";
import { Bien } from "./ElementosEconomicos/Bien/Bien";
import { BienCategoria } from "./ElementosEconomicos/Bien/BienCategoria";
import { BienMarca } from "./ElementosEconomicos/Bien/BienMarca";
import { Magnitud } from "./ElementosEconomicos/Bien/Magnitud";
import { MagnitudTipo } from "./ElementosEconomicos/Bien/MagnitudTipo";
import { Model, Prop, PropBehavior } from "./Model";
import { ErrorModel } from "./utils/ErrorModel";
import { DateTime, Interval } from "luxon";
import { QueryTypes, Sequelize } from 'sequelize';
import { Usuario } from "./Personas/Usuario/Usuario";

@Prop.Class()
class Contenedor extends Model
{
    @Prop.Set( PropBehavior.model, () => Usuario ) usuario?: Usuario;
    @Prop.Set( PropBehavior.array, () => Model ) data: Model[] = [];

    constructor( json?: Partial<Contenedor> )
    {
        super();
        Prop.initialize( this, json );
    }
}

// const data: Model[] = [
//     new Usuario({
//         symbol: Symbol(),
//         id: 1,
//         nombre: "Juan Pérez",
//         usuario: "juan.perez",
//         contrasena: "12345",
//         esActivo: true
//     }),
//     new Bien({
//         symbol: Symbol(),
//         id: 1,
//         codigo: 'EC-00234',
//         nombre: 'Pantalla LCD',
//         magnitudNombre: 'uni',
//         categoria: 'pantallas',
//         precioUnitario: 45.50,
//         bienMarca: new BienMarca({
//             id: 2,
//             nombre: 'LG'
//         }),
//         bienCategoria: new BienCategoria({
//             id: 3,
//             nombre: 'pantallas'
//         }),
//         magnitud: new Magnitud({
//             id: 1,
//             nombre: 'uni',
//             magnitudTipo: new MagnitudTipo({
//                 id: 2,
//                 nombre: 'unidades'
//             })
//         })
//     })
// ];

// const data: any[] = [
//     {
//         symbol: Symbol(),
//         id: 1,
//         nombre: "Juan Pérez",
//         usuario: "juan.perez",
//         contrasena: "12345",
//         esActivo: true,
//         type: Usuario.name
//     },
//     {
//         type: Bien.name,
//         symbol: Symbol(),
//         id: 1,
//         codigo: 'EC-00234',
//         nombre: 'Pantalla LCD',
//         magnitudNombre: 'uni',
//         categoria: 'pantallas',
//         precioUnitario: 45.50,
//         bienMarca: new BienMarca({
//             id: 2,
//             nombre: 'LG'
//         }),
//         bienCategoria: new BienCategoria({
//             id: 3,
//             nombre: 'pantallas'
//         }),
//         magnitud: new Magnitud({
//             id: 1,
//             nombre: 'uni',
//             magnitudTipo: new MagnitudTipo({
//                 id: 2,
//                 nombre: 'unidades'
//             })
//         })
//     }
// ];

// const contenedor = new Contenedor({
//     usuario: new Usuario({
//         symbol: Symbol(),
//         id: 1,
//         nombre: "Juan Pérez",
//         usuario: "juan.perez",
//         contrasena: "12345",
//         esActivo: true
//     }),
//     data: data
// })

// console.log( JSON.stringify( contenedor ) );
// console.log( contenedor );
// console.log( contenedor.data[1] === contenedor.data[1] )
// console.log( ( contenedor.data[1] as Bien ).magnitud === ( contenedor.data[1] as Bien ).magnitud )

// const newContenedor = new Contenedor( contenedor );

// console.log( JSON.stringify( newContenedor ) );
// console.log( newContenedor );
// console.log( contenedor.data[1] === newContenedor.data[1] )
// console.log( ( contenedor.data[1] as Bien ).magnitud === ( newContenedor.data[1] as Bien ).magnitud )


// DECIMAL
// const num = NaN ?? 0;
// console.log( num );

// const a = new Decimal( 2 ).plus( 3 ); // 5
// const a2 = a.plus( 3 ).toNumber();
// const b = new Decimal( 2 ).minus( 3 ).toNumber(); // -1
// const c = new Decimal( 2 ).mul( 3 ).toNumber(); // 6
// const d = new Decimal( 2 ).div( 3 ).toNumber(); // 0.66

// console.log( a.toNumber(), a2, b, c, d );



// DECIMAL
// const decimal = new Decimal( 3 );

// console.log(
//     decimal.plus( 3 ).div( 4 ).toNumber(),
//     decimal.plus( 2 ).toNumber(),
//     decimal.mul( 10 ).minus( 3 ).toNumber(),
//     decimal.mul( 10 ).minus( 3 ).ceil().toNumber()
// )
// decimal.plus( 3 ).div( 4 )
// decimal.plus( 2 )
// decimal.mul( 10 ).minus( 3 )
// decimal.mul( 10 ).minus( 3 )
// console.log( decimal.toNumber() );

// decimal.plus( 7 )
// console.log( decimal.toNumber() );





// ERROR
// try {
//     try {
//         try {
//             throw new ErrorModel("Error en el nivel 1");
//         } catch (e) {
//             if (e instanceof ErrorModel) {
//                 throw new ErrorModel("Error en el nivel 2", e);
//             } else {
//             throw e; // Propagar otros errores
//         }
//       }
//     } catch (e) {
//       if (e instanceof ErrorModel) {
//         throw new ErrorModel("Error en el nivel 2", e);
//       } else {
//         throw e; // Propagar otros errores
//       }
//     }
//   } catch (finalError) {
//     if (finalError instanceof ErrorModel) {
//       console.log("Mensajes acumulados:", finalError.getCombinedMessages());
//     } else {
//       console.error("Otro error:", finalError);
//     }
//   }




// TRY -CATCH
// try {
//     try {
//         try {
//             try {
//                 try {
//                     try {
//                         throw new ErrorModel( 'Error en el nivel 1' );
//                     }
//                     catch ( error ) {
//                         throw new ErrorModel( 'Error en el nivel 2', error );
//                     }
//                 }
//                 catch ( error ) {
//                     throw new ErrorModel( 'Error en el nivel 3', error );
//                 }
//             }
//             catch ( error ) {
//                 throw new ErrorModel( 'Error en el nivel 4', error );
//             }
//         }
//         catch ( error ) {
//             throw new ErrorModel( 'Error en el nivel 5', error );
//         }
//     }
//     catch ( error ) {
//         throw new ErrorModel( 'Error en el nivel 6', error );
//     }
// }
// catch ( error ) {
//     if ( error instanceof ErrorModel ) {
//         console.log("Mensajes acumulados:", error.getAllMessages());
//     } else {
//         throw new ErrorModel( 'Otro error.' );
//     }
// }


const importeNeto = 1320;
const cantidad = 0;
const importeUnitarioPromedio = new Decimal( importeNeto )
                                .div( cantidad )
                                .toDecimalPlaces( 2 )
                                .toNumber();

const otro = new Decimal( 0 )
            .div( 23.23 )
            .minus( importeUnitarioPromedio)
            .toNumber();

console.log( importeUnitarioPromedio, otro );

const number = Infinity;


// const date = DateTime.fromSQL( '0000-01-01 00:00:00' );
// const datetime1 = date.toSQL() ?? '';
// const datetime2 = date.toSQL() ?? '';

// const interval = Interval.fromDateTimes( date, date );

// console.log( date.toSQL() );
// console.log( JSON.stringify( interval.toDuration().toObject() ) );
// console.log( DateTime.local().toSQL() );


// const date = DateTime.fromSQL( '2024-12-13 09:34:23' );
// console.log( date.toSQL() );



// const dateTimeInicio = Prop.toDateTime( undefined );
// const dateTimeFinal = Prop.toDateTime( undefined );

// const interval = Interval.fromDateTimes( dateTimeInicio, dateTimeFinal ); 

// const duracionMinutos = interval.toDuration().minutes;

// const resultado = new Decimal( duracionMinutos )
//                     .mul( 23.234 )
//                     .minus( 100 )
//                     .toDecimalPlaces( 2 )
//                     .toNumber();

// console.log( resultado );
const query = `
SELECT JSON_ARRAYAGG( data ) as elementosEconomicos
from (

    select json_object(
        'id', servicio.id,
        'uuid', elemento_economico.uuid,
        'codigo', elemento_economico.codigo,
        'nombre', servicio.nombre,
        'magnitudNombre', 'uni',
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
    ) as data
    from servicio
    left join elemento_economico on elemento_economico.id = servicio.id

    union all

    select json_object(
        'id', producto.id,
        'uuid', elemento_economico.uuid,
        'codigo', elemento_economico.codigo,
        'nombre', bien.nombre,
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
    left join elemento_economico on elemento_economico.id = bien.id

) as collection;
`;

const query2 = `
select json_object(
    'id', servicio.id,
    'uuid', elemento_economico.uuid,
    'codigo', elemento_economico.codigo,
    'nombre', servicio.nombre,
    'magnitudNombre', 'uni',
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
`;

const query3 = `
select json_object(
        'id', servicio.id,
        'uuid', elemento_economico.uuid,
        'codigo', elemento_economico.codigo,
        'nombre', servicio.nombre,
        'magnitudNombre', 'uni',
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
    ) as data
    from servicio
    left join elemento_economico on elemento_economico.id = servicio.id

    union all

    select json_object(
        'id', producto.id,
        'uuid', elemento_economico.uuid,
        'codigo', elemento_economico.codigo,
        'nombre', bien.nombre,
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
    left join elemento_economico on elemento_economico.id = bien.id
`;


const getData = async () => {

    const sequelize = new Sequelize(
        'servicio_tecnico',
        'root',
        'root123',
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    );
    
    const data = await sequelize.query( query, {
        type: QueryTypes.SELECT,
        replacements: {
            id: null,
            nombre: null
        }
    } );

}

getData();