import { setPinnedFieldsSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setPinnedFieldsCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setPinnedFieldsSchema)
