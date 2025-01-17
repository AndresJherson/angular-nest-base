import Decimal from "decimal.js";
import { DocumentoMovimiento, MedioTransferencia, Prop, PropBehavior } from "../../../index";
import { ErrorModel } from "../../utils/ErrorModel";

@Prop.Class()
export class MovimientoEfectivo extends DocumentoMovimiento
{
    static override type = 'MovimientoEfectivo';
    @Prop.Set( PropBehavior.model, () => MedioTransferencia ) medioTransferencia?: MedioTransferencia;
    @Prop.Set() override type: string = MovimientoEfectivo.type;


    constructor( json?: Partial<MovimientoEfectivo> )
    {
        super();
        Prop.initialize( this, json );
    }


    override procesarInformacionMovimiento(): this 
    {
        try {
            super.procesarInformacionMovimiento();
            
            this.importeNeto = new Decimal( this.importeNeto ).toNumber();
            return this;
        }
        catch ( error ) {
            throw new ErrorModel( 'Error en el cálculo del valor total de Documento de Movimiento de Efectivo', error );
        }
    }


    static initialize( data: Partial<MovimientoEfectivo>[] ): MovimientoEfectivo[]
    {
        return data.map( item => 
            new (
                Prop.GetClass<MovimientoEfectivo>( item.type )
                ?? Prop.GetClass( Object.getPrototypeOf( item ) )
                ?? MovimientoEfectivo
            )( item )
        )
    }
}