import { queryWebhook } from '@undb/integrations'
import * as z from 'zod'

export const getWebhookByIdQueryOutput = z.object({
  webhook: queryWebhook.nullable(),
})
