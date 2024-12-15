import Decimal from "decimal.js";
import { Bien } from "./ElementosEconomicos/Bien";
import { BienCategoria } from "./ElementosEconomicos/BienCategoria";
import { BienMarca } from "./ElementosEconomicos/BienMarca";
import { Magnitud } from "./ElementosEconomicos/Magnitud";
import { MagnitudTipo } from "./ElementosEconomicos/MagnitudTipo";
import { Model, Prop, PropBehavior } from "./Model";
import { Usuario } from "./Personas/Usuario";
import { ErrorModel } from "./utils/ErrorModel";
import { DateTime, Interval } from "luxon";

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



const dateTimeInicio = Prop.toDateTime( undefined );
const dateTimeFinal = Prop.toDateTime( undefined );

const interval = Interval.fromDateTimes( dateTimeInicio, dateTimeFinal ); 

const duracionMinutos = interval.toDuration().minutes;

const resultado = new Decimal( duracionMinutos )
                    .mul( 23.234 )
                    .minus( 100 )
                    .toDecimalPlaces( 2 )
                    .toNumber();

console.log( resultado );