import { setFormFieldVisibilitySchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setFormFieldVisibilityCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFormFieldVisibilitySchema)
