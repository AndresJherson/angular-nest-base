import { Injectable, Scope } from '@nestjs/common';
import { SessionData } from '../interfaces/interfaces';

@Injectable({
    scope: Scope.REQUEST 
})
export class SessionService 
{
    private _sessionData?: SessionData;

    set sessionData(data: SessionData) 
    {
        this._sessionData = data;
    }

    get sessionData(): SessionData 
    {
        if ( this._sessionData === undefined ) throw new Error( 'Datos de Sesión no obtenidos' );
        return this._sessionData;
    }
}
