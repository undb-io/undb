import type { DynamicModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config'
import { BaseConfigService } from './base-config.service.js'
import { configSchema } from './env.validate.js'
import { configurations } from './index.js'

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: configurations,
          validationSchema: configSchema,
        }),
      ],
      providers: [BaseConfigService, ConfigService],
      exports: [BaseConfigService, ConfigService],
    }
  }
}
