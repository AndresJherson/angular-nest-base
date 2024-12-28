import Decimal from "decimal.js";
import { NotaVenta } from "./NotaVenta";
import { Model, Prop, PropBehavior } from "../../Model";
import { ElementoEconomico } from "../../ElementosEconomicos/ElementoEconomico";
import { ErrorModel } from "../../utils/ErrorModel";

export class NotaVentaDetalle extends Model
{
    @Prop.Set( PropBehavior.model, () => NotaVenta ) notaVenta?: NotaVenta;
    
    @Prop.Set( PropBehavior.model, () => ElementoEconomico ) elementoEconomico?: ElementoEconomico;
    @Prop.Set() concepto?: string;
    @Prop.Set() cantidad: number = 0;
    @Prop.Set() importeUnitario: number = 0;
    @Prop.Set() importeBruto: number = 0;
    @Prop.Set() importeDescuento: number = 0;
    @Prop.Set() importeNeto: number = 0;
    @Prop.Set() importeUnitarioPromedio: number= 0;
    @Prop.Set() comentario?: string;


    constructor( json?: Partial<NotaVentaDetalle> )
    {
        super();
        Prop.initialize( this, json );
    }


    setElementoEconomico( elementoEconomico: ElementoEconomico ): this
    {
        this.elementoEconomico = elementoEconomico;
        return this;
    }


    calcularImportes(): this
    {
        try {

            this.importeBruto = new Decimal( this.cantidad )
                                .mul( this.importeUnitario )
                                .toDecimalPlaces( 2 )
                                .toNumber();

            this.importeNeto = new Decimal( this.importeBruto )
                                .minus( this.importeDescuento )
                                .toDecimalPlaces( 2 )
                                .toNumber();

            try {
                this.importeUnitarioPromedio = new Decimal( this.importeNeto )
                                                .div( this.cantidad )
                                                .toDecimalPlaces( 2 )
                                                .toNumber();
            }
            catch ( error ) {
                this.importeUnitarioPromedio = 0;
            }
                               
        }
        catch ( error ) {
            throw new ErrorModel( `Error al calcular detalles`, error );
        }

        return this;
    }
}