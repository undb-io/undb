import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { sumFilterOperators } from './operators.js'

export const sumFilterValue = z.number().nullable()
export const sumFilter = z
  .object({
    type: z.literal('sum'),
    operator: sumFilterOperators,
    value: sumFilterValue,
  })
  .merge(baseFilter)
export type ISumFilter = z.infer<typeof sumFilter>
export type ISumFilterOperator = z.infer<typeof sumFilterOperators>
