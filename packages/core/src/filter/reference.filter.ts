import { z } from 'zod'
import { referenceFieldValue } from '../field/reference-field.type.js'
import { baseFilter } from './filter.base.js'
import { referenceFilterOperators } from './operators.js'

export const referenceFilterValue = referenceFieldValue.or(referenceFieldValue.array()).nullable()
export type IReferenceFilterValue = z.infer<typeof referenceFieldValue>
export const referenceFilter = z
  .object({
    type: z.literal('reference'),
    operator: referenceFilterOperators,
    value: referenceFilterValue,
  })
  .merge(baseFilter)

export type IReferenceFilter = z.infer<typeof referenceFilter>
