import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'
import { ratingFieldValue } from './rating-field.type.js'

export const ratingFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const ratingFilterValue = ratingFieldValue
export const ratingFilter = z
  .object({
    type: z.literal('rating'),
    operator: ratingFilterOperators,
    value: ratingFilterValue,
  })
  .merge(baseFilter)

export type IRatingFilter = z.infer<typeof ratingFilter>
export type IRatingFilterOperator = z.infer<typeof ratingFilterOperators>
