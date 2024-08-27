import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'



export const typeormConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): PostgresConnectionOptions => ({
        /* Settings */
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        dropSchema: false,

        /* Connection */
        type: 'postgres',
        database: configService.get<string>('PSQL_DATABASE'),
        host: configService.get<string>('PSQL_HOST'),
        port: configService.get<number>('PSQL_PORT'),
        username: configService.get<string>('PSQL_USERNAME'),
        password: configService.get<string>('PSQL_PASSWORD'),
        synchronize: configService.get<string>('NODE_ENV') === `local-running`,
    }),
}
