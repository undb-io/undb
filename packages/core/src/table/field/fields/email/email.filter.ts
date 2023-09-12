import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import {
  $contains,
  $ends_with,
  $eq,
  $is_empty,
  $is_not_empty,
  $neq,
  $not_contains,
  $starts_with,
} from '../../../filter/operators.js'

export const emailFilterOperators = z.union([
  $eq,
  $neq,
  $starts_with,
  $ends_with,
  $contains,
  $not_contains,
  $is_empty,
  $is_not_empty,
])

export const emailFilterValue = z.string().nullable()
export const emailFilter = z
  .object({
    type: z.literal('email'),
    operator: emailFilterOperators,
    value: emailFilterValue,
  })
  .merge(baseFilter)

export type IEmailFilter = z.infer<typeof emailFilter>
export type IEmailFilterOperator = z.infer<typeof emailFilterOperators>
