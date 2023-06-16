import { tableIdSchema } from '@undb/core'
import { createWebhookSchema } from '@undb/integrations'
import { z } from 'zod'

export const createWebhookCommandInput = z.object({
  tableId: tableIdSchema,
  webhook: createWebhookSchema,
})
