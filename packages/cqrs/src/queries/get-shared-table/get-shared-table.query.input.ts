import { shareTargetSchema } from '@undb/integrations'
import * as z from 'zod'

export const getSharedTableQueryInput = z.object({
  target: shareTargetSchema,
})
