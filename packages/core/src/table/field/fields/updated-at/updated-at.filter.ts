import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $between, $eq, $gt, $gte, $is_today, $lt, $lte, $neq } from '../../../filter/operators.js'

export const updatedAtFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte, $between, $is_today])
export type IUpdatedAtFilterOperator = z.infer<typeof updatedAtFilterOperators>
export const updatedAtBuiltInOperators = new Set<IUpdatedAtFilterOperator>([$is_today.value])

export const updatedAtFilterValue = z.string().nullable()
export const updatedAtFilter = z
  .object({
    type: z.literal('updated-at'),
    operator: updatedAtFilterOperators,
    value: updatedAtFilterValue,
  })
  .merge(baseFilter)

export type IUpdatedAtFilter = z.infer<typeof updatedAtFilter>
