import { rootFilter, tableIdSchema } from '@undb/core'
import { z } from 'zod'
import { flsIdSchema } from './value-objects/index.js'

export const queryFLS: any = z.object({
  id: flsIdSchema,
  tableId: tableIdSchema,
  policy: z.object({
    filter: rootFilter,
  }),
})

export type IQueryFLS = z.infer<typeof queryFLS>

export const updateFLSSchema = z.object({
  policy: z
    .object({
      filter: rootFilter,
    })
    .partial()
    .optional(),
})

export type IUpdateFLSSchema = z.infer<typeof updateFLSSchema>
