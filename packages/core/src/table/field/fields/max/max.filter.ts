import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'

export const maxFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const maxFilterValue = z.number().nullable()

export const maxFilter = z
  .object({
    type: z.literal('max'),
    operator: maxFilterOperators,
    value: maxFilterValue,
  })
  .merge(baseFilter)

export type IMaxFilter = z.infer<typeof maxFilter>

export type IMaxFilterOperator = z.infer<typeof maxFilterOperators>
