import { z } from 'zod'
import { createFieldSchema } from '../../field'
import { tableIdSchema } from '../../value-objects'

export const creawteFieldCommandInput = z.object({
  id: tableIdSchema,
  field: createFieldSchema,
})
