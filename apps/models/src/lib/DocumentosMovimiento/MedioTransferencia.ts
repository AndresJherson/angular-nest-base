import { Model, Prop } from "../Model";

@Prop.Class()
export class MedioTransferencia extends Model
{
    @Prop.Set() nombre?: string;


    constructor( json?: Partial<MedioTransferencia> )
    {
        super();
        Prop.initialize( this, json );
    }
}