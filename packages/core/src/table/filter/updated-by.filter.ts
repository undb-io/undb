import { z } from 'zod'
import { userIdSchema } from '../../user/value-objects/user-id.vo.js'
import { baseFilter } from './filter.base.js'
import { updatedByFilterOperators } from './operators.js'

export const updatedByFilterValue = userIdSchema
export const updatedByFilter = z
  .object({
    type: z.literal('updated-by'),
    operator: updatedByFilterOperators,
    value: updatedByFilterValue,
  })
  .merge(baseFilter)

export type IUpdatedByFilter = z.infer<typeof updatedByFilter>
