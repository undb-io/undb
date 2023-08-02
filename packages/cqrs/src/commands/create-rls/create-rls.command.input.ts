import { rlsPolicy } from '@undb/authz'
import { tableIdSchema, viewIdSchema } from '@undb/core'
import { ZodObject, ZodOptional, ZodString, z } from 'zod'

export const createRLSCommandInput: ZodObject<{
  tableId: ZodString
  viewId: ZodOptional<ZodString>
  policy: any
}> = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  policy: rlsPolicy,
})
