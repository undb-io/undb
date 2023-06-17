import { MikroORM } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import type { OnModuleInit } from '@nestjs/common'
import { Logger, Module } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { EntityManager, createConfig } from '@undb/sqlite'
import { Request } from 'express'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { AttachmentModule } from './attachment/attachment.module.js'
import { AuthModule } from './auth/auth.module.js'
import { BaseConfigService } from './configs/base-config.service.js'
import { ConfigModule } from './configs/config.module.js'
import { InjectSqliteConfig, sqliteConfig } from './configs/sqlite.config.js'
import { coreModules } from './core/index.js'
import { UserService } from './core/user/user.service.js'
import { HealthModule } from './health/health.module.js'
import { I18nModule } from './i18n/i18n.module.js'
import { OpenAPIModule } from './openapi/openapi.module.js'
import { OutboxModule } from './outbox/outbox.module.js'
import { RealtimeModule } from './realtime/realtime.module.js'
import { RealyModule } from './relay/relay.module.js'
import { TrpcModule } from './trpc/trpc.module.js'
import { WebhookModule } from './webhook/webhook.module.js'

@Module({
  imports: [
    ConfigModule.register(),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => (req.headers['X-Request-Id'] as string) ?? uuid(),
      },
    }),
    HealthModule,
    TrpcModule,
    LoggerModule.forRootAsync({
      useFactory: (config: BaseConfigService) => ({
        pinoHttp: {
          transport: !config.isProd ? { target: 'pino-pretty' } : undefined,
        },
      }),
      inject: [BaseConfigService],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigType<typeof sqliteConfig>) => createConfig(config.data!, process.env.NODE_ENV),
      inject: [sqliteConfig.KEY],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), './out'),
    }),
    ...coreModules,
    AttachmentModule,
    AuthModule,
    I18nModule,
    OpenAPIModule,
    OutboxModule,
    RealyModule,
    WebhookModule.register({}),
    RealtimeModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name)

  constructor(
    private readonly orm: MikroORM,
    private readonly userService: UserService,
    @InjectSqliteConfig() private readonly config: ConfigType<typeof sqliteConfig>,
  ) {}

  async onModuleInit() {
    const em = this.orm.em as EntityManager
    if (this.config.seed) {
      this.logger.log('seeding data...')
      await em.getConnection().loadFile(path.resolve(process.cwd(), '../../data/data.sql')).catch(console.error)
      this.logger.log('seeding data successfully!')
    } else {
      await this.orm.getMigrator().up()
    }
    await this.userService.createAdmin()
  }
}
