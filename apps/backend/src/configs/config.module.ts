import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { BaseConfigService } from './base-config.service.js'
import { configSchema } from './env.validate.js'
import { configurations } from './index.js'

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: configurations,
      validationSchema: configSchema,
    }),
  ],
  providers: [BaseConfigService],
  exports: [BaseConfigService],
})
export class ConfigModule {}
