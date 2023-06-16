import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectWebhookConfig = () => Inject(webhookConfig.KEY)

export const webhookConfig = registerAs('webhook', () => ({
  secret: process.env.UNDB_WEBHOOK_SECRET,
}))
