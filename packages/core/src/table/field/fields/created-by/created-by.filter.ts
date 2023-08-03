import { z } from 'zod'
import { userIdSchema } from '../../../../user/value-objects/user-id.vo.js'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $in, $is_me, $is_not_me, $neq, $nin } from '../../../filter/operators.js'

export const createdByFilterOperators = z.union([$eq, $neq, $in, $nin, $is_me, $is_not_me])
export type ICreatedByFilterOperator = z.infer<typeof createdByFilterOperators>

export const createdByFilterValue = userIdSchema.or(userIdSchema.array()).nullable()
export const createdByFilter = z
  .object({
    type: z.literal('created-by'),
    operator: createdByFilterOperators,
    value: createdByFilterValue,
  })
  .merge(baseFilter)

export type ICreatedByFilter = z.infer<typeof createdByFilter>
