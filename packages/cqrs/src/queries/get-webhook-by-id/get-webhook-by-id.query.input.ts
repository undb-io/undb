import { webhookIdSchema } from '@undb/integrations'
import * as z from 'zod'

export const getWebhookByIdQueryInput = z.object({
  id: webhookIdSchema,
})
