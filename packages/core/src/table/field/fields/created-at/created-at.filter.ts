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

export const createdAtFilterOperators = z.union([
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
export type ICreatedAtFilterOperator = z.infer<typeof createdAtFilterOperators>

export const createdAtFilterValue = z
  .string()
  .nullable()
  .or(z.tuple([z.string(), z.string()]))
export const createdAtFilter = z
  .object({
    type: z.literal('created-at'),
    operator: createdAtFilterOperators,
    value: createdAtFilterValue,
  })
  .merge(baseFilter)

export type ICreatedAtFilter = z.infer<typeof createdAtFilter>
