/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionFilter } from './app/filters/all-exception.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
    
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters( new AllExceptionFilter() );

    const corsOptions: CorsOptions = {
        origin: true,
        methods: [ 'POST' ],
        credentials: true,
        preflightContinue: false,
    }
    app.enableCors( corsOptions );;
    
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    
    const port = process.env.PORT || 3000;
    await app.listen(port);

    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
}

bootstrap();
