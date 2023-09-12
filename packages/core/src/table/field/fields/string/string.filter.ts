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
  $regex,
  $starts_with,
} from '../../../filter/operators.js'

export const stringFilterOperators = z.union([
  $eq,
  $neq,
  $contains,
  $not_contains,
  $starts_with,
  $ends_with,
  $regex,
  $is_empty,
  $is_not_empty,
])

export const stringFilterValue = z.string().nullable()
export const stringFilter = z
  .object({
    type: z.literal('string'),
    operator: stringFilterOperators,
    value: stringFilterValue,
  })
  .merge(baseFilter)

export type IStringFilter = z.infer<typeof stringFilter>
export type IStringFilterOperator = z.infer<typeof stringFilterOperators>
