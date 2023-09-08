import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $between, $eq, $gt, $gte, $is_not_today, $is_today, $lt, $lte, $neq } from '../../../filter/operators.js'

export const createdAtFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte, $between, $is_today, $is_not_today])
export type ICreatedAtFilterOperator = z.infer<typeof createdAtFilterOperators>

export const createdAtFilterValue = z.string().nullable()
export const createdAtFilter = z
  .object({
    type: z.literal('created-at'),
    operator: createdAtFilterOperators,
    value: createdAtFilterValue,
  })
  .merge(baseFilter)

export type ICreatedAtFilter = z.infer<typeof createdAtFilter>
