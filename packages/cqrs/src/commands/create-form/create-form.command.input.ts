import { createFormSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createFormCommandInput = z.object({
  tableId: tableIdSchema,
  form: createFormSchema,
})
