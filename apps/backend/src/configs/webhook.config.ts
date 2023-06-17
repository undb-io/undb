import { Inject } from '@nestjs/common'
import { ConfigType, registerAs } from '@nestjs/config'

export const InjectWebhookConfig = () => Inject(webhookConfig.KEY)

export const webhookConfig = registerAs('webhook', () => ({
  secret: process.env.UNDB_WEBHOOK_SECRET,
  publisher: {
    provider: (process.env.UNDB_WEBHOOK_PUBLISH_PROVIDER || 'memory') as 'memory' | 'temporal',
  },
}))

export type WebhookConfigType = ConfigType<typeof webhookConfig>
