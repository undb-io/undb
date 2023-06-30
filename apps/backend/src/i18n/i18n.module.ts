import type { MiddlewareConsumer, NestModule, OnModuleInit } from '@nestjs/common'
import { Module, RequestMethod } from '@nestjs/common'
import { config } from '@undb/i18n'
import { type i18n } from 'i18next'
import * as middleware from 'i18next-http-middleware'
import { InjectI18Next, i18nextProvider } from './i18next.provider.js'

@Module({
  providers: [i18nextProvider],
})
export class I18nModule implements NestModule, OnModuleInit {
  constructor(@InjectI18Next() private i18next: i18n) {}

  async onModuleInit() {
    await this.i18next.use(middleware.LanguageDetector).init(config)
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(middleware.handle(this.i18next)).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
