import { formIdSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const deleteFormCommandInput = z.object({
  tableId: tableIdSchema,
  formId: formIdSchema,
})
