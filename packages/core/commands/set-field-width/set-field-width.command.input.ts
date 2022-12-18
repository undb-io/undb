import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { setFieldWidthSchema } from '../../view'

export const setFieldWidthCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldWidthSchema)
