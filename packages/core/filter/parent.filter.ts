import { z } from 'zod'
import { parentFieldValue } from '../field/parent-field.type'
import { baseFilter } from './filter.base'
import { parentFilterOperators } from './operators'

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
