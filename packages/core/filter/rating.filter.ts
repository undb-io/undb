import { z } from 'zod'
import { ratingFieldValue } from '../field/rating-field.type.js'
import { baseFilter } from './filter.base.js'
import { ratingFilterOperators } from './operators.js'

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
