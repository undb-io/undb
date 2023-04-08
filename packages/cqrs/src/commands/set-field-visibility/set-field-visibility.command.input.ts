import { setFieldVisibilitySchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setFieldVisibilityCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldVisibilitySchema)
