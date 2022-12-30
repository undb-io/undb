import { z } from 'zod'
import { baseFilter } from './filter.base'
import { dateFilterOperators } from './operators'

export const dateFilterValue = z.date().nullable().optional()
export const dateFilter = z
  .object({
    type: z.literal('date'),
    operator: dateFilterOperators,
    value: dateFilterValue,
  })
  .merge(baseFilter)
export type IDateFilter = z.infer<typeof dateFilter>
