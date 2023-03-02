import { createConfig } from '@egodb/sqlite'
import { MikroORM } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import type { OnModuleInit } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import path from 'path'
import { HealthModule } from './health/health.module'
import { modules } from './modules'
import { TrpcModule } from './trpc/trpc.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    HealthModule,
    TrpcModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      },
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const data = config.get('EGODB_DATABASE_SQLITE_DATA') ?? path.resolve(process.cwd(), '../../.ego/data')
        return createConfig(data, process.env.NODE_ENV)
      },
      inject: [ConfigService],
    }),
    ...modules,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await this.orm.getMigrator().up()
  }
}
