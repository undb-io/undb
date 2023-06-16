import { queryWebhook } from '@undb/integrations'
import * as z from 'zod'

export const getWebhooksQueryOutput = z.object({
  webhooks: z.array(queryWebhook),
})
