import { flsPolicy, subject } from '@undb/authz'
import { fieldIdSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createFLSCommandInput: any = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  policy: flsPolicy,
  subjects: subject.array().optional(),
})
