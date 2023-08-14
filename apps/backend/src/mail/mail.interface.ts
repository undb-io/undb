import type { ISendMailOptions } from '@nestjs-modules/mailer'

export interface IMailService {
  sendMail(options: ISendMailOptions): Promise<void>
}
