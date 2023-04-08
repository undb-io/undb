import { tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const createTableCommandOutput = z.object({
  id: tableIdSchema,
})
