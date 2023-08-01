import { rlsPolicy } from '@undb/authz'
import { tableIdSchema, viewIdSchema } from '@undb/core'
import { ZodObject, ZodString, z } from 'zod'

export const createRLSCommandInput: ZodObject<{
  tableId: ZodString
  viewId: ZodString
  policy: any
}> = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  policy: rlsPolicy,
})
