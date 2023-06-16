import { webhookIdSchema } from '@undb/integrations'
import { z } from 'zod'

export const deleteWebhookCommandInput = z.object({
  webhookId: webhookIdSchema,
})
