import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { jsonFilterOperators } from './operators.js'

export const jsonFilterValue = z.null()
export const jsonFilter = z
  .object({
    type: z.literal('json'),
    operator: jsonFilterOperators,
    value: jsonFilterValue,
  })
  .merge(baseFilter)

export type IJsonFilter = z.infer<typeof jsonFilter>
export type IJsonFilterOperator = z.infer<typeof jsonFilterOperators>
