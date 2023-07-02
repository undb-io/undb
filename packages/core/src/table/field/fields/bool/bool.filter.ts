import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $is_false, $is_true } from '../../../filter/operators.js'

export const boolFilterOperators = z.union([$is_true, $is_false])
export type IBoolFilterOperator = z.infer<typeof boolFilterOperators>

export const boolFilterValue = z.boolean().nullable()
export const boolFilter = z
  .object({
    type: z.literal('bool'),
    operator: boolFilterOperators,
    value: boolFilterValue,
  })
  .merge(baseFilter)

export type IBoolFilter = z.infer<typeof boolFilter>
