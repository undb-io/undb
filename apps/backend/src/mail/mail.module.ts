import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js'
import { Global, Module } from '@nestjs/common'
import { fileURLToPath } from 'node:url'

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        const dir = fileURLToPath(new URL(`./templates`, import.meta.url))
        return {
          transport: {
            host: '0.0.0.0',
            port: 1025,
          },
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
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
    }),
  ],
})
export class MailModule {}
