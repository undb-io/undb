import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { config } from '@undb/i18n'
import i18next from 'i18next'
import middleware from 'i18next-http-middleware'

@Module({})
export class I18nModule implements NestModule, OnModuleInit {
  onModuleInit() {
    i18next.use(middleware.LanguageDetector).init(config)
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(middleware.handle(i18next)).forRoutes('*')
  }
}
