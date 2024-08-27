import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

const logger = new Logger('AppBootstrap')

const DEFAULT_APP_HOST = 'localhost'
const DEFAULT_APP_PORT = 3000

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidUnknownValues: false,
        }),
    )

    const hostname = configService.get('HOST', DEFAULT_APP_HOST)
    const port = configService.get('PORT', DEFAULT_APP_PORT)

    await app.listen(port, hostname, () =>
        logger.log(`Server running at ${hostname}:${port}`),
    )
}

bootstrap()
