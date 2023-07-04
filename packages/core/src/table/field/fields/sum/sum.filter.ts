import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'

export const sumFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const sumFilterValue = z.number().nullable()
export const sumFilter = z
  .object({
    type: z.literal('sum'),
    operator: sumFilterOperators,
    value: sumFilterValue,
  })
  .merge(baseFilter)
export type ISumFilter = z.infer<typeof sumFilter>
export type ISumFilterOperator = z.infer<typeof sumFilterOperators>
