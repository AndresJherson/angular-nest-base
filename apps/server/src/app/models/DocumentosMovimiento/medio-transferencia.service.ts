import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../services/conector.service';
import { AppService } from '../../app.service';
import { MedioTransferencia } from '@app/models';
import { SessionData } from '../../interfaces/interfaces';
import { ERROR_CRUD } from '../../interfaces/constants';
import { SQLBuilder } from '../../services/SQLBuilder';

@Injectable()
export class MedioTransferenciaService {

    query = `
        select json_object(
            'id', medio_transferencia.id,
            'nombre', medio_transferencia.nombre
        )
        from medio_transferencia
    `;
        

    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            medioTransferencia: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new MedioTransferencia( s.json.medioTransferencia ) ),
                createItem: s => this.createItem( s, new MedioTransferencia( s.json.medioTransferencia ) ),
                updateItem: s => this.updateItem( s, new MedioTransferencia( s.json.medioTransferencia ) ),
                deleteItem: s => this.deleteItem( s, new MedioTransferencia( s.json.medioTransferencia ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'medio_transferencia' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: MedioTransferencia,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, medioTransferencia: MedioTransferencia )
    {
        const data = await this.conectorService.executeQuery({
            target: MedioTransferencia,
            transaction: s.transaction,
            query: `
                ${this.query}
                where medio_transferencia.id = :id
            `,
            parameters: {
                id: medioTransferencia.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, medioTransferencia: MedioTransferencia )
    {
        const id = await this.getId( s );

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'medio_transferencia' )
            .values([
                {
                    id: id,
                    nombre: medioTransferencia.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, new MedioTransferencia({id}) );
    }


    async updateItem( s: SessionData, medioTransferencia: MedioTransferencia )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'medio_transferencia' )
            .set({
                nombre: medioTransferencia.nombre ?? null,
            })
            .where({
                id: medioTransferencia.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, medioTransferencia );
    }


    async deleteItem( s: SessionData, medioTransferencia: MedioTransferencia )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'medio_transferencia' )
            .where({
                id: medioTransferencia.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
