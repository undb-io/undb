import { tableIdSchema } from '@egodb/core'
import * as z from 'zod'

export const createTableCommandOutput = z.object({
  id: tableIdSchema,
})
