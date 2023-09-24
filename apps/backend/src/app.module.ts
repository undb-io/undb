import { MikroORM } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import type { OnModuleInit } from '@nestjs/common'
import { Logger, Module } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ServeStaticModule } from '@nestjs/serve-static'
import type { EntityManager } from '@undb/sqlite'
import { createConfig } from '@undb/sqlite'
import type { Request } from 'express'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { AppInfoModule } from './appInfo/appInfo.module.js'
import { AttachmentModule } from './attachment/attachment.module.js'
import { AuditModule } from './audit/audit.module.js'
import { AuthModule } from './auth/auth.module.js'
import { AuthService } from './auth/auth.service.js'
import { AuthzModule } from './authz/authz.module.js'
import { BaseModule } from './base/base.module.js'
import { CacheModule } from './cache/cache.module.js'
import { authConfig } from './configs/auth.config.js'
import { BaseConfigService } from './configs/base-config.service.js'
import { ConfigModule } from './configs/config.module.js'
import { InjectSqliteConfig, sqliteConfig } from './configs/sqlite.config.js'
import { coreModules } from './core/index.js'
import { HealthModule } from './health/health.module.js'
import { I18nModule } from './i18n/i18n.module.js'
import { InvitationModule } from './invitation/invitation.module.js'
import { MailModule } from './mail/mail.module.js'
import { OpenAPIModule } from './openapi/openapi.module.js'
import { OutboxModule } from './outbox/outbox.module.js'
import { RealtimeModule } from './realtime/realtime.module.js'
import { RelayModule } from './relay/relay.module.js'
import { ShareModule } from './share/share.module.js'
import { TemplateModule } from './template/template.module.js'
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
    CacheModule,
    HealthModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        secret: config.jwt.secret,
        signOptions: {
          expiresIn: '20d',
        },
      }),
      inject: [authConfig.KEY],
    }),
    AuthzModule,
    TrpcModule,
    MailModule.register({}),
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
      rootPath: process.env.UNDB_FRONTEND_OUT_DIR || path.resolve(process.cwd(), './out'),
    }),
    ...coreModules,
    BaseModule,
    AttachmentModule,
    AuthModule,
    I18nModule,
    OpenAPIModule,
    OutboxModule,
    RelayModule,
    WebhookModule.register({}),
    RealtimeModule,
    ShareModule,
    AuditModule,
    AppInfoModule,
    InvitationModule,
    TemplateModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name)

  constructor(
    private readonly orm: MikroORM,
    private readonly authService: AuthService,
    @InjectSqliteConfig() private readonly config: ConfigType<typeof sqliteConfig>,
  ) {}

  async onModuleInit() {
    const em = this.orm.em.fork() as EntityManager

    if (this.config.seed) {
      this.logger.log('seeding data...')
      await em.getConnection().loadFile(path.resolve(process.cwd(), '../../data/data.sql')).catch(console.error)
      this.logger.log('seeding data successfully!')
    } else {
      await this.orm.getMigrator().up()
    }
    await this.authService.createAdmin()
  }
}
