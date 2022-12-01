import * as z from 'zod'
import { tableIdSchema } from '../../value-objects'

export const createTableCommandOutput = z.object({
  id: tableIdSchema,
})
