import { Controller, Get, HttpCode, InternalServerErrorException, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { RequestTransaction, SessionData } from './interfaces/interfaces';
import { Prop } from 'apps/models/src/lib/Model';
import { Response } from 'express';

@UseInterceptors( TransactionInterceptor )
@Controller()
export class AppController {

    constructor(private readonly appService: AppService) {}

    @Post()
    @HttpCode( 200 )
    async resolve(
        @Req() req: RequestTransaction,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {

            const service = Prop.setString( req.body.service ) ?? '';
            const method = Prop.setString( req.body.method ) ?? '';
            const json: Record<string,any> = typeof req.body.values === 'object'
                                                ? req.body.values
                                                : {};

            const s: SessionData = {
                req,
                res,
                transaction: req.transaction,
                json
            }

            return await this.appService.resolve( service, method, s );
        }
        catch ( error: any ) {
            throw new InternalServerErrorException( error.message ?? 'INTERNAL SERVER ERROR' );
        }
    }
}
