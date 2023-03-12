import { setPinnedFieldsSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const setPinnedFieldsCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setPinnedFieldsSchema)
