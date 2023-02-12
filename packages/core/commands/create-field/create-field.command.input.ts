import { z } from 'zod'
import { createFieldSchema } from '../../field/index.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const createFieldCommandInput = z.object({
  tableId: tableIdSchema,
  field: createFieldSchema,
})
