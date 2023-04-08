import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { dateRangeFilterOperators } from './operators.js'

const datetime = z.string().datetime().nullable()
export const dateRangeFilterValue = z.tuple([datetime, datetime])
export const dateRangeFilter = z
  .object({
    type: z.literal('date-range'),
    operator: dateRangeFilterOperators,
    value: dateRangeFilterValue,
  })
  .merge(baseFilter)
export type IDateRangeFilter = z.infer<typeof dateRangeFilter>
