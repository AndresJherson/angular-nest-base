import { Model, Prop } from "../../index";

@Prop.Class()
export class MedioTransferencia extends Model
{
    static override type = 'MedioTransferencia';
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<MedioTransferencia> )
    {
        super();
        Prop.initialize( this, json );
    }
}