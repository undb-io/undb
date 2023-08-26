import { flsPolicy } from '@undb/authz'
import { tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createFLSCommandInput: any = z.object({
  tableId: tableIdSchema,
  policy: flsPolicy,
})
