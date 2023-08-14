import type { ISendMailOptions } from '@nestjs-modules/mailer'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import type { IMailService } from './mail.interface.js'

@Injectable()
export class BasicMailService implements IMailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(options: ISendMailOptions): Promise<void> {
    await this.mailService.sendMail(options)
  }
}
