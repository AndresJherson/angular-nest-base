import Decimal from 'decimal.js';
export enum TipoProporcion
{
    directa,
    inversa
}

export class Proporcion
{
    public tipo: TipoProporcion;
    public antecedente: number;
    public consecuente: number;


    constructor( tipo: TipoProporcion, antecedente: number, consecuente: number ) 
    {
        // if ( antecedente <= 0 || consecuente <= 0 ) {
        //     throw new Error("El antecedente y el consecuente deben ser mayores que cero.");
        // }
        this.tipo = tipo;
        this.antecedente = antecedente;
        this.consecuente = consecuente;
    }

    // Método para calcular el antecedente, dado un consecuente
    calcularAntecedente( dadoConsecuente: number ): Decimal
    {
        // if ( dadoConsecuente <= 0 ) throw new Error( "El consecuente debe ser mayor que cero." );

        try {

            if ( this.tipo === TipoProporcion.directa ) {

                return new Decimal( this.antecedente )
                        .mul( dadoConsecuente )
                        .div( this.consecuente );

            } else {

                return new Decimal( this.antecedente )
                        .mul( this.consecuente )
                        .div( dadoConsecuente );
                
            }

        }
        catch ( error ) {
            return new Decimal( 0 );
        }

    }

    // Método para calcular el consecuente, dado un antecedente
    calcularConsecuente( dadoAntecedente: number ): Decimal
    {
        // if ( dadoAntecedente <= 0 ) throw new Error("El antecedente debe ser mayor que cero.");

        try {
            
            if ( this.tipo === TipoProporcion.directa ) {

                return new Decimal( this.consecuente )
                        .mul( dadoAntecedente )
                        .div( this.antecedente );

            } else {

                return new Decimal( this.antecedente )
                        .mul( this.consecuente )
                        .div( dadoAntecedente );
        
            }
            
        }
        catch ( error ) {
            return new Decimal( 0 );
        }

    }

    // Método para invertir la proporción (cambiar antecedente por consecuente)
    invertir(): void 
    {
        [this.antecedente, this.consecuente] = [this.consecuente, this.antecedente];
    }

    // Método para verificar si esta proporción es equivalente a otra
    esEquivalente( otra: Proporcion ): boolean 
    {
        const valorDecimal1 = this.antecedente / this.consecuente;
        const valorDecimal2 = otra.antecedente / otra.consecuente;
        return valorDecimal1 === valorDecimal2 && this.tipo === otra.tipo;
    }

    // Obtener el valor decimal de la proporción
    get valorDecimal(): Decimal
    {
        return new Decimal( this.antecedente ).div( this.consecuente );
    }

    // Representación en forma de cadena
    toString(): string 
    {
        return `${this.antecedente} : ${this.consecuente} (${this.tipo})`;
    }
}
