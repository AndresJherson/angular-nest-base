import { Controller, Get, HttpCode, InternalServerErrorException, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { SessionService } from './services/session.service';

@UseInterceptors( TransactionInterceptor )
@Controller()
export class AppController {

    constructor(
        private readonly appService: AppService,
        private sessionService: SessionService
    ) {}


    @Post()
    @HttpCode( 200 )
    async resolve()
    {
        return await this.appService.resolve( 
            this.sessionService.sessionData.service, 
            this.sessionService.sessionData.method, 
            this.sessionService.sessionData 
        );
    }
}
