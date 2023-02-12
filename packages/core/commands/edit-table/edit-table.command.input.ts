import { z } from 'zod'
import { editTableSchema } from '../../table.schema.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const editTableCommandInput = z
  .object({
    id: tableIdSchema,
  })
  .merge(editTableSchema)
