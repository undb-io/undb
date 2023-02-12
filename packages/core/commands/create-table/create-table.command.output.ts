import * as z from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'

export const createTableCommandOutput = z.object({
  id: tableIdSchema,
})
