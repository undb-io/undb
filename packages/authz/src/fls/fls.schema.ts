import { fieldIdSchema, rootFilter, tableIdSchema } from '@undb/core'
import { z } from 'zod'
import { subject } from '../common/index.js'
import { flsIdSchema } from './value-objects/index.js'

export const queryFLS: any = z.object({
  id: flsIdSchema,
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  policy: z.object({
    filter: rootFilter,
  }),
  subjects: subject.array(),
})

export type IQueryFLS = z.infer<typeof queryFLS>

export const updateFLSSchema = z.object({
  policy: z
    .object({
      filter: rootFilter,
    })
    .partial()
    .optional(),
  subjects: subject.array(),
})

export type IUpdateFLSSchema = z.infer<typeof updateFLSSchema>
