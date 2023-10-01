import { createBaseSchema, tableIdSchema } from '@undb/core'
import { templateSchema } from '@undb/template'
import { z } from 'zod'

export const createBaseCommandInput = createBaseSchema.merge(
  z.object({
    tableIds: tableIdSchema.array().nonempty().optional(),
    template: templateSchema.optional(),
  }),
)
