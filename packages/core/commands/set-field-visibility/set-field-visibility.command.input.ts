import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setFieldVisibilitySchema } from '../../view/index.js'

export const setFieldVisibilityCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldVisibilitySchema)
