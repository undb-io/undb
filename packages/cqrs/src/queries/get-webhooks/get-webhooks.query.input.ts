import { tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const getWebhooksQueryInput = z.object({
  tableId: tableIdSchema,
})
