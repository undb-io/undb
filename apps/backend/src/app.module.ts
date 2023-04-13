import { MikroORM } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import type { OnModuleInit } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { createConfig } from '@undb/sqlite'
import { Request } from 'express'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { AttachmentModule } from './attachment/attachment.module.js'
import { AuthModule } from './auth/auth.module.js'
import { BaseConfigService } from './configs/base-config.service.js'
import { ConfigModule } from './configs/config.module.js'
import { sqliteConfig } from './configs/sqlite.config.js'
import { HealthModule } from './health/health.module.js'
import { I18nModule } from './i18n/i18n.module.js'
import { modules } from './modules/index.js'
import { UserService } from './modules/user/user.service.js'
import { TrpcModule } from './trpc/trpc.module.js'

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
    ...modules,
    AttachmentModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), './out'),
    }),
    AuthModule,
    I18nModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM, private readonly userService: UserService) {}

  async onModuleInit() {
    await this.orm.getMigrator().up()
    await this.userService.createAdmin()
  }
}
