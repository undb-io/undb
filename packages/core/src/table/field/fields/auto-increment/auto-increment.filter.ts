import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'

export const autoIncrementFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const autoIncrementFilterValue = z.number().nullable()
export const autoIncrementFilter = z
  .object({
    type: z.literal('auto-increment'),
    operator: autoIncrementFilterOperators,
    value: autoIncrementFilterValue,
  })
  .merge(baseFilter)

export type IAutoIncrementFilter = z.infer<typeof autoIncrementFilter>
export type IAutoIncrementFilterOperator = z.infer<typeof autoIncrementFilterOperators>
