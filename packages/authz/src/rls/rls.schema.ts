import { rootFilter, tableIdSchema } from '@undb/core'
import { z } from 'zod'
import { rlsIdSchema, rlsSubject } from './value-objects/index.js'

export const queryRLS: any = z.object({
  id: rlsIdSchema,
  tableId: tableIdSchema,
  policy: z.object({
    // action: rlsAction,
    filter: rootFilter,
  }),
  subjects: rlsSubject.array(),
})

export type IQueryRLS = z.infer<typeof queryRLS>

export const updateRLSSchema = z.object({
  policy: z
    .object({
      // action: rlsAction,
      filter: rootFilter,
    })
    .partial()
    .optional(),
  subjects: rlsSubject.array(),
})

export type IUpdateRLSSchema = z.infer<typeof updateRLSSchema>
