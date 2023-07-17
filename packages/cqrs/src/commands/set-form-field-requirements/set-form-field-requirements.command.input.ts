import { setFormFieldRequirementsSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setFormFieldRequirementsCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setFormFieldRequirementsSchema)
