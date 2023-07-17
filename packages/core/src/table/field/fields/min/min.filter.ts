import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $gt, $gte, $lt, $lte, $neq } from '../../../filter/operators.js'

export const minFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const minFilterValue = z.number().nullable()

export const minFilter = z
  .object({
    type: z.literal('min'),
    operator: minFilterOperators,
    value: minFilterValue,
  })
  .merge(baseFilter)

export type IMinFilter = z.infer<typeof minFilter>

export type IMinFilterOperator = z.infer<typeof minFilterOperators>
