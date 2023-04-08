import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { averageFilterOperators } from './operators.js'

export const averageFilterValue = z.number().nullable()
export const averageFilter = z
  .object({
    type: z.literal('average'),
    operator: averageFilterOperators,
    value: averageFilterValue,
  })
  .merge(baseFilter)
export type IAverageFilter = z.infer<typeof averageFilter>
export type IAverageFilterOperator = z.infer<typeof averageFilterOperators>
