import { tableIdSchema } from '@undb/core'
import { updateWebhookSchema, webhookIdSchema } from '@undb/integrations'
import { z } from 'zod'

export const updateWebhookCommandInput = z.object({
  tableId: tableIdSchema,
  webhookId: webhookIdSchema,
  webhook: updateWebhookSchema,
})
