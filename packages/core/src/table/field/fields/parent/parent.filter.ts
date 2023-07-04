import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $neq } from '../../../filter/operators.js'
import { parentFieldValue } from './parent-field.type.js'

export const parentFilterOperators = z.union([$eq, $neq])
export type IParentFilterOperator = z.infer<typeof parentFilterOperators>

export const parentFilterValue = parentFieldValue.or(parentFieldValue.array()).nullable()
export type IParentFilterValue = z.infer<typeof parentFieldValue>
export const parentFilter = z
  .object({
    type: z.literal('parent'),
    operator: parentFilterOperators,
    value: parentFilterValue,
  })
  .merge(baseFilter)

export type IParentFilter = z.infer<typeof parentFilter>
