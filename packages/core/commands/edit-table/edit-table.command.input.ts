import { z } from 'zod'
import { editTableSchema } from '../../table.schema'
import { tableIdSchema } from '../../value-objects'

export const editTableCommandInput = z
  .object({
    id: tableIdSchema,
  })
  .merge(editTableSchema)
