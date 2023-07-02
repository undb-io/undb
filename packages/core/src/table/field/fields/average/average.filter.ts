import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'

export const averageFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const averageFilterValue = z.number().nullable()
export const averageFilter = z
  .object({
    type: z.literal('average'),
    operator: averageFilterOperators,
    value: averageFilterValue,
  })
  .merge(baseFilter)
export type IAverageFilter = z.infer<typeof averageFilter>
export type IAverageFilterOperator = z.infer<typeof averageFilterOperators>
