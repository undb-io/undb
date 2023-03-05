import { setFieldVisibilitySchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setFieldVisibilityCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldVisibilitySchema)
