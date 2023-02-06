import { z } from 'zod'
import { createFieldSchema } from '../../field'
import { tableIdSchema } from '../../value-objects'

export const createFieldCommandInput = z.object({
  tableId: tableIdSchema,
  field: createFieldSchema,
})
