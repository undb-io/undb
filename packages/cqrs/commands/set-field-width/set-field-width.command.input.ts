import { setFieldWidthSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setFieldWidthCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldWidthSchema)
