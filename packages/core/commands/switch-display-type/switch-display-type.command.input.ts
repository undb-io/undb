import { z } from 'zod'
import { tableIdSchema } from '../../value-objects'
import { switchDisplayTypeSchema } from '../../view'

export const switchDisplayTypeCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(switchDisplayTypeSchema)
