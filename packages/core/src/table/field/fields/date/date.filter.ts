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

export const dateFilterOperators = z.union([
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

export const dateFilterValue = z
  .string()
  .nullable()
  .or(z.tuple([z.string(), z.string()]))
export const dateFilter = z
  .object({
    type: z.literal('date'),
    operator: dateFilterOperators,
    value: dateFilterValue,
  })
  .merge(baseFilter)
export type IDateFilter = z.infer<typeof dateFilter>

export type IDateFilterOperator = z.infer<typeof dateFilterOperators>

/**
 * built in date operators
 */
export const dateBuiltInOperators = new Set<IDateFilterOperator>([
  $is_today.value,
  $is_not_today.value,
  $is_tomorrow.value,
  $is_yesterday.value,
])

export const isBuiltInDateOperator = (operator: IDateFilterOperator) => dateBuiltInOperators.has(operator)
