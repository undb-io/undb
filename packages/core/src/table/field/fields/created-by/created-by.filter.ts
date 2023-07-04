import { z } from 'zod'
import { userIdSchema } from '../../../../user/value-objects/user-id.vo.js'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $in, $is_empty, $is_not_empty, $neq, $nin } from '../../../filter/operators.js'

export const createdByFilterOperators = z.union([$eq, $neq, $in, $nin, $is_empty, $is_not_empty])
export type ICreatedByFilterOperator = z.infer<typeof createdByFilterOperators>

export const createdByFilterValue = userIdSchema
export const createdByFilter = z
  .object({
    type: z.literal('created-by'),
    operator: createdByFilterOperators,
    value: createdByFilterValue,
  })
  .merge(baseFilter)

export type ICreatedByFilter = z.infer<typeof createdByFilter>
