import { z } from 'zod'
import { userIdSchema } from '../../user/value-objects/user-id.vo.js'
import { baseFilter } from './filter.base.js'
import { createdByFilterOperators } from './operators.js'

export const createdByFilterValue = userIdSchema
export const createdByFilter = z
  .object({
    type: z.literal('created-by'),
    operator: createdByFilterOperators,
    value: createdByFilterValue,
  })
  .merge(baseFilter)

export type ICreatedByFilter = z.infer<typeof createdByFilter>
