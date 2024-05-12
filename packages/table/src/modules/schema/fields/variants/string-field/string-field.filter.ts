import { z } from 'zod'
import { baseFilter } from '../../../../filters/base.filter'

export const stringFieldFilter = z.union([
  z
    .object({
      op: z.literal('eq'),
      value: z.string().min(1),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal('neq'),
      value: z.string().min(1),
    })
    .merge(baseFilter),
])

export type IStringFieldFilterSchema = typeof stringFieldFilter
export type IStringFieldFilter = z.infer<typeof stringFieldFilter>
