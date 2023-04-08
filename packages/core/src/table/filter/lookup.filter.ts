import { z } from 'zod'
import { lookupFieldValue } from '../field/lookup-field.type.js'
import { baseFilter } from './filter.base.js'
import { lookupFilterOperators } from './operators.js'

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
