import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { boolFilterOperators } from './operators.js'

export const boolFilterValue = z.boolean().nullable()
export const boolFilter = z
  .object({
    type: z.literal('bool'),
    operator: boolFilterOperators,
    value: boolFilterValue,
  })
  .merge(baseFilter)

export type IBoolFilter = z.infer<typeof boolFilter>
