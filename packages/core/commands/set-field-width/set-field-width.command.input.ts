import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { setFieldWidthSchema } from '../../view/index.js'

export const setFieldWidthCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFieldWidthSchema)
