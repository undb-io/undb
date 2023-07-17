import { formIdSchema, tableIdSchema, updateFormSchema } from '@undb/core'
import { z } from 'zod'

export const updateFormCommandInput = z
  .object({
    tableId: tableIdSchema,
    formId: formIdSchema,
  })
  .merge(updateFormSchema)
