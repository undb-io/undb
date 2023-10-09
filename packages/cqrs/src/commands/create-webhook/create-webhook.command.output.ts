import { webhookIdSchema } from '@undb/integrations'
import { z } from 'zod'

export const createWebhookCommandOutput = z.object({
  id: webhookIdSchema,
})
