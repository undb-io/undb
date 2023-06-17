import { Inject, Provider } from '@nestjs/common'
import { Client, Connection } from '@temporalio/client'
import { WebhookConfigType, webhookConfig } from '../../configs/webhook.config.js'

export const TEMPORAL_CLIENT = Symbol('TEMPORAL_CLIENT')

export const InjectTemporalClient = () => Inject(TEMPORAL_CLIENT)

export const temporalClient: Provider = {
  provide: TEMPORAL_CLIENT,
  inject: [webhookConfig.KEY],
  useFactory: async (config: WebhookConfigType) => {
    const connection = await Connection.connect({
      address: config.publisher.temporal.addr,
    })

    const client = new Client({
      connection,
      namespace: config.publisher.temporal.namespace,
    })

    return client
  },
}
