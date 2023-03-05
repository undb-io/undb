import { z } from 'zod'
import { dateRangeFieldValue } from '../field/date-range-field.type.js'
import { baseFilter } from './filter.base.js'
import { dateRangeFilterOperators } from './operators.js'

export const dateRangeFilterValue = dateRangeFieldValue
export const dateRangeFilter = z
  .object({
    type: z.literal('date-range'),
    operator: dateRangeFilterOperators,
    value: dateRangeFilterValue,
  })
  .merge(baseFilter)
export type IDateRangeFilter = z.infer<typeof dateRangeFilter>
