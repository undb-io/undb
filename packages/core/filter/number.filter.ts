import { z } from 'zod'
import { baseFilter } from './filter.base'
import { numberFilterOperators } from './operators'

export const numberFilterValue = z.number().nullable()
export const numberFilter = z
  .object({
    type: z.literal('number'),
    operator: numberFilterOperators,
    value: numberFilterValue,
  })
  .merge(baseFilter)
export type INumberFilter = z.infer<typeof numberFilter>
export type INumberFilterOperator = z.infer<typeof numberFilterOperators>
