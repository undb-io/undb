import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js'
import type { DynamicModule } from '@nestjs/common'
import { ConfigurableModuleBuilder, Global, Module } from '@nestjs/common'
import { fileURLToPath } from 'node:url'
import type { MailConfigType } from '../configs/mail.config.js'
import { mailConfig } from '../configs/mail.config.js'
import { providers } from './providers.js'

export const { ConfigurableModuleClass: MailConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder().build()

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class MailModule extends MailConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const imports: DynamicModule['imports'] = []

    const provider = process.env.UNDB_MAIL_PROVIDER
    if (provider === 'basic') {
      const module = MailerModule.forRootAsync({
        inject: [mailConfig.KEY],
        useFactory: (config: MailConfigType) => {
          const dir = fileURLToPath(new URL(`./templates`, import.meta.url))
          return {
            transport: {
              host: config.host,
              port: config.port,
            },
            defaults: {
              from: config.defaultFrom,
            },
            template: {
              dir,
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }
        },
      })
      imports.push(module)
    }

    return {
      ...super.register(options),
      imports,
    }
  }
}
