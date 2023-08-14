import type { ISendMailOptions } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import type { IMailService } from './mail.interface.js'

@Injectable()
export class NoopMailService implements IMailService {
  async sendMail(options: ISendMailOptions): Promise<void> {
    return
  }
}
