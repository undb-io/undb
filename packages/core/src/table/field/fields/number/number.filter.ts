import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $is_empty, $is_not_empty, $lt, $lte, $neq } from '../../../filter/operators.js'

export const numberFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte, $is_empty, $is_not_empty])

export const numberFilterValue = z.number().nullable()
export const numberFilter = z
  .object({
    type: z.literal('number'),
    operator: numberFilterOperators,
    value: numberFilterValue,
  })
  .merge(baseFilter)
export type INumberFilter = z.infer<typeof numberFilter>
export type INumberFilterOperator = z.infer<typeof numberFilterOperators>
