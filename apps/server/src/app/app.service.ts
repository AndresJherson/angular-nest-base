import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionData } from './interfaces/interfaces';

@Injectable()
export class AppService {

    private routes: Record< string, Record< string, ( s: SessionData ) => Promise<any> > > = {};


    async resolve( service: string, method: string, sessionData: SessionData )
    {
        const isService = Object.keys( this.routes ).includes( service );
        if ( !isService ) throw new NotFoundException( 'Servicio inexistente' );

        const isMethod = Object.keys( this.routes[service] ).includes( method );
        if ( !isMethod ) throw new NotFoundException( 'Metodo inexistente' );

        return await this.routes[ service ][ method ]( sessionData );
    }


    register( service: Record< string, Record< string, ( s: SessionData ) => Promise<any> > > )
    {
        this.routes = {
            ...this.routes,
            ...service
        };
    }
}
