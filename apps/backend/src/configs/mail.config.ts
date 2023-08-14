import { Inject } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'

export const InjectMailConfig = () => Inject(mailConfig.KEY)

export const mailConfig = registerAs('mail', () => ({
  provider: process.env.UNDB_MAIL_PROVIDER as 'basic' | undefined,
  health: process.env.UNDB_MAIL_HEALTH,
  host: process.env.UNDB_MAIL_HOST,
  port: process.env.UNDB_MAIL_PORT ? parseInt(process.env.UNDB_MAIL_PORT, 10) : undefined,
  defaultFrom: process.env.UNDB_MAIL_DEFAULT_FROM,
}))

export type MailConfigType = ConfigType<typeof mailConfig>
