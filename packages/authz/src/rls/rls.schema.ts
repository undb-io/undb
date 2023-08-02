import { rootFilter, tableIdSchema, viewIdSchema } from '@undb/core'
import { z } from 'zod'
import { rlsAction, rlsIdSchema } from './value-objects'

export const queryRLS: any = z.object({
  id: rlsIdSchema,
  tableId: tableIdSchema,
  viewId: viewIdSchema.optional(),
  policy: z.object({
    action: rlsAction,
    filter: rootFilter,
  }),
})

export type IQueryRLS = z.infer<typeof queryRLS>
