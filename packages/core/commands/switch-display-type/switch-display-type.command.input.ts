import { z } from 'zod'
import { tableIdSchema } from '../../value-objects/index.js'
import { switchDisplayTypeSchema } from '../../view/index.js'

export const switchDisplayTypeCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(switchDisplayTypeSchema)
