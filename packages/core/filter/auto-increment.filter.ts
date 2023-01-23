import { z } from 'zod'
import { baseFilter } from './filter.base'
import { autoIncrementFilterOperators } from './operators'

export const autoIncrementFilterValue = z.number().nullable()
export const autoIncrementFilter = z
  .object({
    type: z.literal('auto-increment'),
    operator: autoIncrementFilterOperators,
    value: autoIncrementFilterValue,
  })
  .merge(baseFilter)

export type IAutoIncrementFilter = z.infer<typeof autoIncrementFilter>
