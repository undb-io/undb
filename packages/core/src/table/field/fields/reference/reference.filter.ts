import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $neq } from '../../../filter/operators.js'
import { referenceFieldValue } from './reference-field.type.js'

export const referenceFilterOperators = z.union([$eq, $neq])
export type IReferenceFilterOperator = z.infer<typeof referenceFilterOperators>

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
