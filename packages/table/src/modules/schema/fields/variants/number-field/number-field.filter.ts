import { z } from 'zod'
import { baseFilter } from '../../../../filters/base.filter'

export const numberFieldFilter = z.union([
  z
    .object({
      op: z.literal('eq'),
      value: z.number(),
    })
    .merge(baseFilter),
  z
    .object({
      op: z.literal('neq'),
      value: z.number(),
    })
    .merge(baseFilter),
])

export type INumberFieldFilter = z.infer<typeof numberFieldFilter>
