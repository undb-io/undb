import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import {
  $between,
  $end_eq,
  $end_gt,
  $end_gte,
  $end_lt,
  $end_lte,
  $end_neq,
  $eq,
  $is_empty,
  $is_not_empty,
  $neq,
  $start_eq,
  $start_gt,
  $start_gte,
  $start_lt,
  $start_lte,
  $start_neq,
} from '../../../filter/operators.js'

export const dateRangeFilterOperators = z.union([
  $eq,
  $neq,
  $between,
  $is_empty,
  $is_not_empty,

  $start_eq,
  $start_neq,
  $start_gt,
  $start_lt,
  $start_gte,
  $start_lte,

  $end_eq,
  $end_neq,
  $end_gt,
  $end_lt,
  $end_gte,
  $end_lte,
])

const datetime = z.string().nullable()
export const dateRangeFilterValue = z.tuple([datetime, datetime]).or(datetime.unwrap()).nullable()

export const dateRangeFilter = z
  .object({
    type: z.literal('date-range'),
    operator: dateRangeFilterOperators,
    value: dateRangeFilterValue,
  })
  .merge(baseFilter)
export type IDateRangeFilter = z.infer<typeof dateRangeFilter>

export type IDateRangeFilterOperator = z.infer<typeof dateRangeFilterOperators>

const dateRangeDateOperators = new Set<IDateRangeFilterOperator>([
  '$start_eq',
  '$start_neq',
  '$start_gt',
  '$start_lt',
  '$start_gte',
  '$start_lte',
  '$end_eq',
  '$end_neq',
  '$end_gt',
  '$end_lt',
  '$end_gte',
  '$end_lte',
])

export const isDateRangeDateOperator = (o: IDateRangeFilterOperator) => dateRangeDateOperators.has(o)
