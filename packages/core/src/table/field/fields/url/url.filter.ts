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

export const urlFilterOperators = z.union([
  $eq,
  $neq,
  $starts_with,
  $ends_with,
  $contains,
  $not_contains,
  $is_empty,
  $is_not_empty,
])

export const urlFilterValue = z.string().nullable()
export const urlFilter = z
  .object({
    type: z.literal('url'),
    operator: urlFilterOperators,
    value: urlFilterValue,
  })
  .merge(baseFilter)

export type IUrlFilter = z.infer<typeof urlFilter>
export type IUrlFilterOperator = z.infer<typeof urlFilterOperators>
