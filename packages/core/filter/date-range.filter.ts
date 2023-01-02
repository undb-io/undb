import { z } from 'zod'
import { baseFilter } from './filter.base'
import { dateRangeFilterOperators } from './operators'

export const dateRangeFilterValue = z.date().nullable().optional()
export const dateRangeFilter = z
  .object({
    type: z.literal('date-range'),
    field: z.union([z.literal('from'), z.literal('to'), z.null()]),
    operator: dateRangeFilterOperators,
    value: dateRangeFilterValue,
  })
  .merge(baseFilter)
export type IDateRangeFilter = z.infer<typeof dateRangeFilter>
