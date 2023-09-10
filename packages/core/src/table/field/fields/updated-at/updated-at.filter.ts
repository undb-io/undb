import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import {
  $between,
  $eq,
  $gt,
  $gte,
  $is_not_today,
  $is_today,
  $is_tomorrow,
  $is_yesterday,
  $lt,
  $lte,
  $neq,
} from '../../../filter/operators.js'

export const updatedAtFilterOperators = z.union([
  $eq,
  $neq,
  $gt,
  $gte,
  $lt,
  $lte,
  $between,
  $is_today,
  $is_tomorrow,
  $is_yesterday,
  $is_not_today,
])
export type IUpdatedAtFilterOperator = z.infer<typeof updatedAtFilterOperators>
export const updatedAtBuiltInOperators = new Set<IUpdatedAtFilterOperator>([
  $is_today.value,
  $is_not_today.value,
  $is_tomorrow.value,
  $is_yesterday.value,
])

export const updatedAtFilterValue = z
  .string()
  .nullable()
  .or(z.tuple([z.string(), z.string()]))

export const updatedAtFilter = z
  .object({
    type: z.literal('updated-at'),
    operator: updatedAtFilterOperators,
    value: updatedAtFilterValue,
  })
  .merge(baseFilter)

export type IUpdatedAtFilter = z.infer<typeof updatedAtFilter>
