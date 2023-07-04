import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'

export const countFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const countFilterValue = z.number().nullable()
export const countFilter = z
  .object({
    type: z.literal('count'),
    operator: countFilterOperators,
    value: countFilterValue,
  })
  .merge(baseFilter)

export type ICountFilter = z.infer<typeof countFilter>
export type ICountFilterOperator = z.infer<typeof countFilterOperators>
