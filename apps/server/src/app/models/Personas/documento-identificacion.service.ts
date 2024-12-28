import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../services/conector.service';
import { SessionData } from '../../interfaces/interfaces';
import { DocumentoIdentificacion } from 'apps/models/src/lib/Personas/DocumentoIdentificacion';
import { ERROR_CRUD } from '../../interfaces/constants';
import { AppService } from '../../app.service';
import { SQLBuilder } from '../../services/SQLBuilder';

@Injectable()
export class DocumentoIdentificacionService {

    query = `
        select json_object(
            'id', documento_identificacion.id,
            'nombre', documento_identificacion.nombre
        ) as documentoIdentificacion
        from documento_identificacion
    `;
        

    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            documentoIdentificacion: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new DocumentoIdentificacion( s.json.documentoIdentificacion ) ),
                createItem: s => this.createItem( s, new DocumentoIdentificacion( s.json.documentoIdentificacion ) ),
                updateItem: s => this.updateItem( s, new DocumentoIdentificacion( s.json.documentoIdentificacion ) ),
                deleteItem: s => this.deleteItem( s, new DocumentoIdentificacion( s.json.documentoIdentificacion ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'documento_identificacion' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: DocumentoIdentificacion,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, documentoIdentificacion: DocumentoIdentificacion )
    {
        const data = await this.conectorService.executeQuery({
            target: DocumentoIdentificacion,
            transaction: s.transaction,
            query: `
                ${this.query}
                where documento_identificacion.id = :id
            `,
            parameters: {
                id: documentoIdentificacion.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, documentoIdentificacion: DocumentoIdentificacion )
    {
        const id = await this.getId( s );

        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'documento_identificacion' )
            .values([
                {
                    id: id,
                    nombre: documentoIdentificacion.nombre ?? null,
                }
            ])
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, new DocumentoIdentificacion({id}) );
    }


    async updateItem( s: SessionData, documentoIdentificacion: DocumentoIdentificacion )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'documento_identificacion' )
            .set({
                nombre: documentoIdentificacion.nombre ?? null,
            })
            .where({
                id: documentoIdentificacion.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, documentoIdentificacion );
    }


    async deleteItem( s: SessionData, documentoIdentificacion: DocumentoIdentificacion )
    {
        const affectedRows = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'documento_identificacion' )
            .where({
                id: documentoIdentificacion.id ?? null,
            })
        });

        if ( affectedRows === 0 ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}
