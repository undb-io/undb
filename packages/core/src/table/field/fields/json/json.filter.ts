import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $is_empty, $is_not_empty } from '../../../filter/operators.js'

export const jsonFilterOperators = z.union([$is_empty, $is_not_empty])
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
