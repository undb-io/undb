import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { BasicMailService } from './basic-mail.service.js'
import { NoopMailService } from './noop-mail.service.js'

export const MAIL_SERVICE = Symbol('MAIL_SERVICE')

export const InjectMailService = () => Inject(MAIL_SERVICE)

export const providers: Provider[] = [
  {
    provide: MAIL_SERVICE,
    useClass: process.env.UNDB_MAIL_PROVIDER === 'basic' ? BasicMailService : NoopMailService,
  },
]
