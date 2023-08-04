import { rlsPolicy } from '@undb/authz'
import { tableIdSchema } from '@undb/core'
import type { ZodObject, ZodString } from 'zod'
import { z } from 'zod'

export const createRLSCommandInput: ZodObject<{
  tableId: ZodString
  policy: any
}> = z.object({
  tableId: tableIdSchema,
  policy: rlsPolicy,
})
