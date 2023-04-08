import { setFieldWidthSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setFieldWidthCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldWidthSchema)
