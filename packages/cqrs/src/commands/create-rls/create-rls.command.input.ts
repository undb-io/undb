import { rlsPolicy, rlsSubject } from '@undb/authz'
import { tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createRLSCommandInput: any = z.object({
  tableId: tableIdSchema,
  policy: rlsPolicy,
  subjects: rlsSubject.array().optional(),
})
