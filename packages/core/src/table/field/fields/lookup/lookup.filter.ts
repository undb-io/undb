import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $neq } from '../../../filter/operators.js'
import { lookupFieldValue } from './lookup-field.type.js'

export const lookupFilterOperators = z.union([$eq, $neq])
export type ILookupFilterOperator = z.infer<typeof lookupFilterOperators>

export const lookupFilterValue = lookupFieldValue.or(lookupFieldValue.unwrap()).nullable()
export type ILookupFilterValue = z.infer<typeof lookupFieldValue>
export const lookupFilter = z
  .object({
    type: z.literal('lookup'),
    operator: lookupFilterOperators,
    value: lookupFilterValue,
  })
  .merge(baseFilter)

export type ILookupFilter = z.infer<typeof lookupFilter>
