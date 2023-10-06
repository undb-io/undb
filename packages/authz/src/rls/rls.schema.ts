import { rootFilter, tableIdSchema } from '@undb/core'
import { z } from 'zod'
import { subject } from '../common/index.js'
import { rlsIdSchema } from './value-objects/index.js'

export const queryRLS: any = z.object({
  id: rlsIdSchema,
  tableId: tableIdSchema,
  policy: z.object({
    // action: rlsAction,
    filter: rootFilter,
  }),
  subjects: subject.array(),
})

export type IQueryRLS = z.infer<typeof queryRLS>

export const updateRLSSchema: any = z.object({
  policy: z
    .object({
      // action: rlsAction,
      filter: rootFilter,
    })
    .partial()
    .optional(),
  subjects: subject.array(),
})

export type IUpdateRLSSchema = z.infer<typeof updateRLSSchema>
