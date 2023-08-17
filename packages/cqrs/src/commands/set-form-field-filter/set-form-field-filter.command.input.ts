import { setFormFieldFilterSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setFormFieldFilterCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFormFieldFilterSchema)
