import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConectorService } from '../../../../services/conector.service';
import { SessionData } from '../../../../interfaces/interfaces';
import { Producto } from '../../../../../../../models/src/lib/ElementosEconomicos/Bien/Producto/Producto';
import { ERROR_CRUD } from '../../../../interfaces/constants';
import { v4 } from 'uuid';
import { SQLBuilder } from 'apps/server/src/app/services/SQLBuilder';
import { AppService } from 'apps/server/src/app/app.service';

@Injectable()
export class ProductoService {

    query = `
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
    

    constructor(
        private conectorService: ConectorService,
        private appService: AppService
    )
    {
        this.appService.register({
            producto: {
                getCollection: s => this.getCollection( s ),
                getItem: s => this.getItem( s, new Producto( s.json.producto ) ),
                createItem: s => this.createItem( s, new Producto( s.json.producto ) ),
                updateItem: s => this.updateItem( s, new Producto( s.json.producto ) ),
                deleteItem: s => this.deleteItem( s, new Producto( s.json.producto ) )
            }
        });
    }


    async getId( s: SessionData )
    {
        return await this.conectorService.getId( s.transaction, 'elemento_economico' );
    }


    async getCollection( s: SessionData )
    {
        return await this.conectorService.executeQuery({
            target: Producto,
            transaction: s.transaction,
            query: this.query
        });
    }


    async getItem( s: SessionData, producto: Producto )
    {
        const data = await this.conectorService.executeQuery({
            target: Producto,
            transaction: s.transaction,
            query: `
                ${this.query}
                where producto.id = :id
            `,
            parameters: {
                id: producto.id ?? null
            }
        });

        if ( data.length === 0 ) throw new InternalServerErrorException( ERROR_CRUD.SELECT );

        return data[ 0 ];
    }


    async createItem( s: SessionData, producto: Producto )
    {
        producto.set({
            id: await this.getId( s ),
            uuid: v4()
        });


        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'elemento_economico' )
            .values([
                {
                    id: producto.id ?? null,
                    uuid: producto.uuid ?? null,
                    codigo: `PRDCT${producto.id ?? ''}`
                }
            ])
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'bien' )
            .values([
                {
                    id: producto.id ?? null,
                    nombre: producto.nombre ?? null,
                    bien_marca_id: producto.bienMarca?.id ?? null,
                    bien_categoria_id: producto.bienCategoria?.id ?? null,
                    magnitud_id: producto.magnitud?.id ?? null
                }
            ])
        });


        const affectedRows3 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.insert( 'producto' )
            .values([
                {
                    id: producto.id ?? null,
                    precio_uni: producto.precioUnitario ?? 0,
                    es_salida: Number( producto.esSalida )
                }
            ])
        });


        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0 
        ) throw new InternalServerErrorException( ERROR_CRUD.CREATE );
        
        return await this.getItem( s, producto );
    }


    async updateItem( s: SessionData, producto: Producto )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'bien' )
            .set({
                nombre: producto.nombre ?? null,
                bien_marca_id: producto.bienMarca?.id ?? null,
                bien_categoria_id: producto.bienCategoria?.id ?? null,
                magnitud_id: producto.magnitud?.id ?? null
            })
            .where({
                id: producto.id ?? null,
            })
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.update( 'producto' )
            .set({
                precio_uni: producto.precioUnitario ?? 0,
                es_salida: Number( producto.esSalida )
            })
            .where({
                id: producto.id ?? null,
            })
        });


        if (
            affectedRows1 === 0 &&
            affectedRows2 === 0
        ) throw new InternalServerErrorException( ERROR_CRUD.UPDATE );
        
        return await this.getItem( s, producto );
    }


    async deleteItem( s: SessionData, producto: Producto )
    {
        const affectedRows1 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'producto' )
            .where({
                id: producto.id ?? null,
            })
        });


        const affectedRows2 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'bien' )
            .where({
                id: producto.id ?? null,
            })
        });


        const affectedRows3 = await this.conectorService.executeNonQuery({
            transaction: s.transaction,
            ...SQLBuilder.delete( 'elemento_economico' )
            .where({
                id: producto.id ?? null,
            })
        });

        if ( 
            affectedRows1 === 0 &&
            affectedRows2 === 0 &&
            affectedRows3 === 0 
        ) throw new InternalServerErrorException( ERROR_CRUD.DELETE );
    }
}