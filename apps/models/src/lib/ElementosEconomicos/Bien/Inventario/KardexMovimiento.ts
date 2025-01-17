import { DocumentoMovimiento, Model, Prop, PropBehavior  } from "../../../../index";

@Prop.Class()
export class KardexMovimiento extends Model
{
    static override type = 'KardexMovimiento';
    @Prop.Set() type: string = KardexMovimiento.type;

    @Prop.Set( PropBehavior.datetime ) fecha?: string;
    @Prop.Set() concepto?: string;
    @Prop.Set() codigoDocumentoMovimiento?: string;
    @Prop.Set() codigoDocumentoTransaccion?: string;
    
    @Prop.Set() entradaCantidad?: number;
    @Prop.Set() entradaCostoUnitario?: number;
    @Prop.Set() entradaCostoTotal?: number;

    @Prop.Set() salidaCantidad?: number;
    @Prop.Set() salidaCostoUnitario?: number;
    @Prop.Set() salidaCostoTotal?: number;

    @Prop.Set() saldoCantidad?: number;
    @Prop.Set() saldoValorUnitario?: number;
    @Prop.Set() saldoValorTotal?: number;

    constructor( item?: Partial<KardexMovimiento> )
    {
        super();
        Prop.initialize( this, item );
    }
}