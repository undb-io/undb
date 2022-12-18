import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { setFieldVisibilitySchema } from '../../view'

export const setFieldVisibilityCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldVisibilitySchema)
