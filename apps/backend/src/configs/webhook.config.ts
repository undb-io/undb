import { Inject } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'

export const InjectWebhookConfig = () => Inject(webhookConfig.KEY)

export const webhookConfig = registerAs('webhook', () => ({
  secret: process.env.UNDB_WEBHOOK_SECRET,
  publisher: {
    provider: (process.env.UNDB_WEBHOOK_PUBLISH_PROVIDER || 'memory') as 'memory' | 'temporal',
    temporal: {
      addr: process.env.UNDB_WEBHOOK_TEMPORAL_ADDR,
      namespace: process.env.UNDB_WEBHOOK_TEMPORAL_NAMESPACE,
    },
  },
}))

export type WebhookConfigType = ConfigType<typeof webhookConfig>
