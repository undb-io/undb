import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $between, $eq, $neq } from '../../../filter/operators.js'

export const dateRangeFilterOperators = z.union([$eq, $neq, $between])

const datetime = z.string().nullable()
export const dateRangeFilterValue = z.tuple([datetime, datetime])
export const dateRangeFilter = z
  .object({
    type: z.literal('date-range'),
    operator: dateRangeFilterOperators,
    value: dateRangeFilterValue,
  })
  .merge(baseFilter)
export type IDateRangeFilter = z.infer<typeof dateRangeFilter>

export type IDateRangeFilterOperator = z.infer<typeof dateRangeFilterOperators>
