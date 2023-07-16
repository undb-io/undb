import { setFormFieldsOrderSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setFormFieldsOrderCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFormFieldsOrderSchema)
