import { z } from 'zod'
import { parentFieldValue } from '../field/parent-field.type.js'
import { baseFilter } from './filter.base.js'
import { parentFilterOperators } from './operators.js'

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
